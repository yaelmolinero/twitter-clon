import * as db from '../config/db';
import { NotFoundError, ConflictError } from '../utils/customErrors';

import type { FollowsQuery } from '../types/interactions.d';

export class FollowsModel {
  static async startFollowing({ followerID, userToFollowID }: FollowsQuery) {
    try {
      await db.query('INSERT INTO follows (follower_id, following_id) VALUES ($1, $2);', [followerID, userToFollowID]);

    } catch (error) {
      const { code } = (error as { code?: string });

      if (code === '23505') throw new ConflictError('Ya sigues a esta cuenta');
      if (code === '23503') throw new NotFoundError('La cuanta que tratas de seguir no existe o fue eliminada.');

      if (error instanceof Error) throw error;
      throw new Error('Error desconocido');
    }
  }

  static async stopFollowing({ followerID, userToFollowID }: FollowsQuery) {
    const result = await db.query('DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING *;', [followerID, userToFollowID]);
    if (!result.rowCount) throw new NotFoundError('No sigues a esta cuenta.');
  }
}
