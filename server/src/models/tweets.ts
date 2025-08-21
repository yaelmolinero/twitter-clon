import * as db from '../config/db';
import { AuthorizationError, BadRequestError, NotFoundError } from '../utils/customErrors';

import type { CreateTweet, Tweet, DeletedTweet, GetTweetsBase, GetFeedParams, GetTweetParams, GetTweetCommentsParams, GetTweetsReactedByUser, GetTweetsByUser, GetRepliesIDs } from '../types/tweets.d';
import type { TweetIDType, ImageUrlType, UserIDType } from '../types/types.d';

export class TweetsModel {

  static async getTweetsBase({ sessionID, offset, orderBy: orderByParam, extraWhere = '', extraJoin = '', extraParams = [], isLiked = false, isBookmarked = false }: GetTweetsBase): Promise<Tweet[]> {
    // Si sessionID es null, no necesitamos calcular los metadatos de usuario
    const checkLike = !isLiked ? 'EXISTS(SELECT 1 FROM likes AS l WHERE l.tweet_id = t.id AND l.user_id = $2)' : 'TRUE';
    const checkBookmark = !isBookmarked ? 'EXISTS(SELECT 1 FROM bookmarks AS b WHERE b.tweet_id = t.id AND b.user_id = $2)' : 'TRUE';
    const orderBy = orderByParam ?? 'ORDER BY t.id DESC';

    const result = await db.query(
      `SELECT
        t.id,
        JSON_BUILD_OBJECT(
          'id', u.id::TEXT,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'bio', u.bio
        ) AS user,
        t.parent_tweet_id AS "parentTweetID",
        t.content,
        t.image_url AS "imageUrl",
        t.created_at AS "createdAt",
        FALSE AS deleted,
        COALESCE((SELECT COUNT(*) FROM tweets AS c WHERE c.parent_tweet_id = t.id AND c.deleted_at IS NULL), 0) AS comments,
        COALESCE((SELECT COUNT(*) FROM retweets AS r WHERE r.tweet_id = t.id), 0) AS retweets,
        COALESCE((SELECT COUNT(*) FROM likes AS l WHERE l.tweet_id = t.id), 0) AS likes,
        JSON_BUILD_OBJECT(
          'likedByUser',  ${sessionID ? checkLike : 'FALSE'},
          'bookmarkedByUser', ${sessionID ? checkBookmark : 'FALSE'},
          'retweetedByUser', ${sessionID ? 'EXISTS(SELECT 1 FROM retweets AS r WHERE r.tweet_id = t.id AND r.user_id = $2)' : 'FALSE'}
        ) AS "userMeta",
        $2 AS sessionRequest
      FROM tweets AS t
      LEFT JOIN users AS u ON u.id = t.user_id
      ${extraJoin}
      WHERE t.deleted_at IS NULL ${extraWhere}
      ${orderBy}
      LIMIT 10 OFFSET $1;`,
      [offset, sessionID, ...extraParams]
    );

    // return result.rows;
    return result.rows.map(data => {
      const { sessionrequest, ...res } = data;
      return res;
    });
  }

  // Obtiene los tweets que vera el usuario en su feed (general o siguiendo)
  static async getTweets({ sessionID, page, following = false }: GetFeedParams): Promise<Tweet[]> {
    const extraJoin = following ? 'JOIN follows AS f ON f.following_id = u.id' : '';
    const extraWhere = following ? 'AND f.follower_id = $2' : '';
    const offset = 10 * (page - 1);

    if (following && sessionID == null) throw new BadRequestError('Para ver los tweets de las cuentas que sigue la sesion, es necesario su estar autenticado.');
    return this.getTweetsBase({ sessionID, offset, extraJoin, extraWhere: `AND t.parent_tweet_id IS NULL ${extraWhere}` });
  }

  static async getThreadById({ sessionID, tweetID }: GetTweetParams): Promise<(Tweet | DeletedTweet)[]> {
    const checkLike = sessionID ? 'EXISTS(SELECT 1 FROM likes AS l WHERE l.tweet_id = t.id AND l.user_id = $2)' : 'FALSE';
    const checkRetweet = sessionID ? 'EXISTS(SELECT 1 FROM retweets AS r WHERE r.tweet_id = t.id AND r.user_id = $2)' : 'FALSE';
    const checkBookmark = sessionID ? 'EXISTS(SELECT 1 FROM bookmarks AS b WHERE b.tweet_id = t.id AND b.user_id = $2)' : 'FALSE';

    const selectQuery = `
      SELECT
        t.id,
        JSON_BUILD_OBJECT(
          'id', u.id::TEXT,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'bio', u.bio
          ) AS user,
        t.parent_tweet_id AS "parentTweetID",
        t.content,
        t.image_url AS "imageUrl",
        t.created_at AS "createdAt",
        (t.deleted_at IS NOT NULL) AS deleted,
        COALESCE((SELECT COUNT(*) FROM tweets AS c WHERE c.parent_tweet_id = t.id), 0) AS comments,
        COALESCE((SELECT COUNT(*) FROM retweets AS r WHERE r.tweet_id = t.id), 0) AS retweets,
        COALESCE((SELECT COUNT(*) FROM likes AS l WHERE l.tweet_id = t.id), 0) AS likes,
        JSON_BUILD_OBJECT(
          'likedByUser', ${checkLike},
          'retweetedByUser', ${checkRetweet},
          'bookmarkedByUser', ${checkBookmark}
        ) AS "userMeta",
		    CASE
          WHEN u.id = $2 OR $2 IS NULL THEN NULL
          ELSE JSON_BUILD_OBJECT(
            'isFollowing', EXISTS(SELECT 1 FROM follows AS f WHERE f.follower_id = $2 AND f.following_id = u.id),
            'isFollowedBy', EXISTS(SELECT 1 FROM follows AS f WHERE f.follower_id = u.id AND f.following_id = $2)
          )
        END AS "userMetaFollow"
    `;

    const result = await db.query(
      `WITH RECURSIVE tweet_thread AS (
        ${selectQuery}
        FROM tweets AS t
        LEFT JOIN users AS u
          ON u.id = t.user_id
        WHERE t.id = $1

        UNION ALL

        ${selectQuery}
        FROM tweets AS t
        JOIN tweet_thread AS tt ON t.id = tt."parentTweetID"
        LEFT JOIN users AS u ON u.id = t.user_id
      )
      SELECT * FROM tweet_thread
      ORDER BY id;`,
      [tweetID, sessionID ?? null]
    );

    if (!result.rowCount) throw new NotFoundError('Este tweet no existe o fue eliminado.');

    const mappedTweets = result.rows.map((tweet) =>
      !tweet.deleted ? tweet : {
        ...tweet,
        user: null,
        content: null,
        imageUrl: null,
        createdAt: null
      }
    );

    return mappedTweets;
  }

  static async getRepliesIDs({ userID, page }: GetRepliesIDs): Promise<{ id: UserIDType }[]> {
    const offset = 5 * (page - 1);

    const result = await db.query(
      `SELECT t.id FROM tweets AS t
        WHERE t.user_id = $1 AND t.parent_tweet_id IS NOT NULL AND deleted_at IS NULL
        AND NOT EXISTS(SELECT 1 FROM tweets AS tt WHERE tt.parent_tweet_id = t.id AND tt.user_id = $1)
      ORDER BY t.id DESC
      LIMIT 5 OFFSET $2;`,
      [userID, offset]
    );

    return result.rows;
  }

  static async getTweetComments({ tweetID, sessionID, page }: GetTweetCommentsParams): Promise<Tweet[]> {
    const offset = 10 * (page - 1);
    return this.getTweetsBase({ sessionID, offset, extraWhere: 'AND t.parent_tweet_id = $3', extraParams: [tweetID] });
  }

  static async getTweetsByUser({ userID, page, multimedia = false, sessionID }: GetTweetsByUser): Promise<Tweet[]> {
    const offset = 10 * (page - 1);
    const extraWhere = `AND t.user_id = $3 AND t.parent_tweet_id IS NULL ${multimedia ? 'AND t.image_url IS NOT NULL' : ''}`;

    return this.getTweetsBase({ sessionID, offset, extraWhere, extraParams: [userID] });
  }

  static async getLikedTweetsByUser({ page, sessionID }: GetTweetsReactedByUser): Promise<Tweet[]> {
    const offset = 10 * (page - 1);
    const extraJoin = 'JOIN likes AS l ON l.tweet_id = t.id';
    const extraWhere = 'AND l.user_id = $2';

    return this.getTweetsBase({ sessionID, offset, extraJoin, extraWhere, isLiked: true });
  }

  static async getBookmarkedTweetsByUser({ page, sessionID }: GetTweetsReactedByUser): Promise<Tweet[]> {
    const offset = 10 * (page - 1);
    const extraJoin = 'JOIN bookmarks AS b ON b.tweet_id = t.id';
    const extraWhere = 'AND b.user_id = $2';

    return this.getTweetsBase({ sessionID, offset, extraJoin, extraWhere, isBookmarked: true });

  }

  static async createTweet({ userID, content, imageUrl, parentTweetID }: CreateTweet): Promise<TweetIDType> {
    const result = await db.query(
      'INSERT INTO tweets (user_id, content, image_url, parent_tweet_id) VALUES ($1, $2, $3, $4) RETURNING id;',
      [userID, content, imageUrl, parentTweetID]
    );

    const tweetId = result.rows[0].id;
    return tweetId;
  }

  static async deleteTweet({ tweetID, sessionID }: GetTweetParams): Promise<ImageUrlType> {
    await db.query('BEGIN TRANSACTION;');
    const result = await db.query('UPDATE tweets SET deleted_at = NOW() WHERE id = $1 RETURNING user_id, image_url;', [tweetID]);

    if (result.rows[0].user_id !== sessionID) {
      await db.query('ROLLBACK;');
      throw new AuthorizationError('No eres creador de este tweet');
    }

    await db.query('COMMIT;');
    return result.rows[0].image_url;
  }
}
