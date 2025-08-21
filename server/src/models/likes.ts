import * as db from '../config/db';
import { NotFoundError, ConflictError } from '../utils/customErrors';

import type { InteractionQuery } from '../types/interactions.d';

export class LikesModel {
  static async createLike({ userID, tweetID }: InteractionQuery) {
    try {
      await db.query('INSERT INTO likes (user_id, tweet_id) VALUES ($1, $2);', [userID, tweetID]);

    } catch (error) {
      const { code } = (error as { code?: string });

      if (code === '23505') throw new ConflictError('Este tweet ya cuenta con el like del usuario');
      if (code === '23503') throw new NotFoundError('Tweet no encontrado.');

      if (error instanceof Error) throw error;
      throw new Error('Error desconocido');
    }
  }

  static async removeLike({ userID, tweetID }: InteractionQuery) {
    const result = await db.query('DELETE FROM likes WHERE user_id = $1 AND tweet_id = $2;', [userID, tweetID]);
    if (!result.rowCount) throw new NotFoundError('Tweet no encontrado.');
  }
}
