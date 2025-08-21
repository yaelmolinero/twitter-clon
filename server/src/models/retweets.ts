import * as db from '../config/db';
import { NotFoundError, ConflictError } from '../utils/customErrors';

import type { InteractionQuery } from '../types/interactions.d';

export class RetweetsModel {
  static async createRetweet({ userID, tweetID }: InteractionQuery) {
    try {
      await db.query('INSERT INTO retweets (user_id, tweet_id) VALUES ($1, $2);', [userID, tweetID]);

    } catch (error) {
      const { code } = (error as { code?: string });

      if (code === '23505') throw new ConflictError('El usuario ya ha compartido este tweet.');
      if (code === '23503') throw new NotFoundError('El tweet que tratas de compartir no existe.');

      if (error instanceof Error) throw error;
      throw new Error('Error desconocido');
    }
  }

  static async removeRetweet({ userID, tweetID }: InteractionQuery) {
    const result = await db.query('DELETE FROM retweets WHERE user_id = $1 AND tweet_id = $2 RETURNING *;', [userID, tweetID]);
    if (!result.rowCount) throw new NotFoundError('Tweet compartido no encontrado.');
  }
}
