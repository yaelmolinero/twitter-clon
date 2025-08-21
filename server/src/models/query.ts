import * as db from '../config/db';

import type { QueryTweetParams, QueryParams } from '../types/interactions.d';
import type { Tweet } from '../types/tweets.d';
import type { UserCard } from '../types/users.d';

export class QueryModel {
  static async searchUsers({ query, page, sessionID }: QueryParams): Promise<UserCard[]> {
    const offset = 10 * (page - 1);

    const users = await db.query(
      `SELECT
        u.id,
        u.name,
        u.username,
        u.avatar,
        u.bio,
        JSON_BUILD_OBJECT(
          'isFollowing', EXISTS(SELECT 1 FROM follows AS f WHERE f.follower_id = $3 AND f.following_id = u.id),
          'isFollowedBy', EXISTS(SELECT 1 FROM follows AS f WHERE f.follower_id = u.id AND f.following_id = $3)
        ) AS "userMeta"
      FROM users AS u
      WHERE u.id != $3 AND (
        LOWER(u.username) LIKE '%' || $1 || '%'
        OR LOWER(u.name) LIKE '%' || $1 || '%'
      )
      LIMIT 10 OFFSET $2;`,
      [query, offset, sessionID]
    );

    return users.rows;
  }

  static async searchTweets({ query, page, sessionID, onlyImages = false }: QueryTweetParams): Promise<Tweet[]> {
    const offset = 10 * (page - 1);
    const filterWithImages = onlyImages ? 'AND t.image_url IS NOT NULL' : '';

    const tweets = await db.query(
      `SELECT
        t.id,
        JSON_BUILD_OBJECT(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'bio', u.bio
        ) AS user,
        t.content,
        t.image_url AS "imageUrl",
        t.created_at AS "createdAt",
        FALSE AS deleted,
        COALESCE((SELECT COUNT(*) FROM tweets WHERE parent_tweet_id = t.id), 0) AS comments,
        COALESCE((SELECT COUNT(*) FROM likes WHERE tweet_id = t.id), 0) AS likes,
        COALESCE((SELECT COUNT(*) FROM retweets WHERE tweet_id = t.id), 0) AS retweets,
        JSON_BUILD_OBJECT(
          'likedByUser', EXISTS(SELECT 1 FROM likes AS l WHERE l.tweet_id = t.id AND l.user_id = $3),
          'bookmarkedByUser', EXISTS(SELECT 1 FROM bookmarks AS b WHERE b.tweet_id = t.id AND b.user_id = $3),
          'retweetedByUser', EXISTS(SELECT 1 FROM retweets AS r WHERE r.tweet_id = t.id AND r.user_id = $3)
        ) AS "userMeta"
      FROM tweets AS t
      LEFT JOIN users AS u ON u.id = t.user_id
      WHERE (LOWER(t.content) LIKE '%' || $1 || '%' OR LOWER(u.username) LIKE $1 || '%') AND deleted_at IS NULL ${filterWithImages}
      ORDER BY t.id DESC
      LIMIT 10 OFFSET $2;`,
      [query, offset, sessionID]
    );

    return tweets.rows;
  }
}