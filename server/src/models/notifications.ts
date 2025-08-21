import * as db from '../config/db';

import type { NotificationQuery, NotificationType } from '../types/interactions.d';
import type { UserIDType } from '../types/types.d';

export class NotificationsModel {
  static async getUserNotifications(sessionID: UserIDType): Promise<NotificationType[]> {
    const result = await db.query(
      `SELECT
        n.id::TEXT,
        JSON_BUILD_OBJECT(
          'id', u.id::TEXT,
          'name', u.name,
          'username', u.username,
          'avatar', u.avatar,
          'bio', u.bio
        ) AS sender,
        n.type,
        CASE
          WHEN n.tweet_id IS NOT NULL AND n.type = 'comment' THEN
            JSON_BUILD_OBJECT(
              'id', t.id::TEXT,
              'content', t.content,
              'imageUrl', t.image_url,
              'parentTweetID', t.parent_tweet_id,
              'deleted', t.deleted_at IS NOT NULL,
              'createdAt', t.created_at,
              'comments', COALESCE((SELECT COUNT(*) FROM tweets AS c WHERE c.parent_tweet_id = t.id), 0)::TEXT,
              'likes', COALESCE((SELECT COUNT(*) FROM likes AS l WHERE l.tweet_id = t.id), 0)::TEXT,
              'retweets', COALESCE((SELECT COUNT(*) FROM retweets AS r WHERE r.tweet_id = t.id), 0)::TEXT,
              'userMeta', JSON_BUILD_OBJECT(
                'likedByUser', EXISTS(SELECT 1 FROM likes AS l WHERE l.tweet_id = t.id AND l.user_id = $1),
                'bookmarkedByUser', EXISTS(SELECT 1 FROM bookmarks AS b WHERE b.tweet_id = t.id AND b.user_id = $1),
                'retweetedByUser', EXISTS(SELECT 1 FROM retweets AS r WHERE r.tweet_id = t.id AND r.user_id = $1)
              )
            )
            WHEN n.tweet_id IS NOT NULL THEN
              JSON_BUILD_OBJECT(
                'id', t.id::TEXT,
                'content', t.content,
                'imageUrl', t.image_url
              )
          ELSE NULL
        END AS tweet,
        n.checked
      FROM notifications AS n
      JOIN users AS u ON u.id = n.sender_id
      LEFT JOIN tweets AS t ON t.id = n.tweet_id
      WHERE n.recipient_id = $1
      ORDER BY n.id DESC
      LIMIT 20;`,
      [sessionID]
    );

    return result.rows;
  }

  static async createNotification(input: NotificationQuery) {
    const { recipientID, senderID, type, tweetID } = input;

    await db.query(
      `INSERT INTO notifications (recipient_id, sender_id, type, tweet_id)
      SELECT $1, $2, $3::VARCHAR, $4
      WHERE NOT EXISTS (
        SELECT 1 FROM notifications
        WHERE recipient_id = $1
        AND sender_id = $2
        AND type = $3::VARCHAR
        AND tweet_id = $4
        AND created_at >= NOW() - INTERVAL '30 minutes'
      );`,
      [recipientID, senderID, type, tweetID]
    );
  }

  static async setNotificationCheck(id: string) {
    await db.query('UPDATE notifications SET checked = TRUE WHERE id = $1', [id]);
  }

  static async deleteNotification(input: NotificationQuery) {
    const { recipientID, senderID, type, tweetID } = input;

    await db.query(
      `DELETE FROM notifications
      WHERE recipient_id = $1
      AND sender_id = $2
      AND type = $3
      AND tweet_id = $4`,
      [recipientID, senderID, type, tweetID]
    );
  }
}
