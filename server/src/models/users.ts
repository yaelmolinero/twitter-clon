import * as db from '../config/db';
import { NotFoundError } from '../utils/customErrors';

import type {
  UserPublicProfile, UserEditableInfo, UserCard, UserBasic,
  GetFollowsParams, FindUserBy, GetUserParams, GetSuggestionsParams
} from '../types/users.d';
import type { UsernameType } from '../types/types.d';

export class UsersModel {
  static async getUser({ username, sessionID }: GetUserParams): Promise<UserPublicProfile> {
    const result = await db.query(
      `SELECT
      u.id,
      u.name,
      u.username,
      u.avatar,
      u.cover,
      u.bio,
      u.location,
      u.website,
      u.created_at AS "createdAt",
      COALESCE((SELECT COUNT(*) FROM follows AS f WHERE f.following_id = u.id), 0) AS followers,
      COALESCE((SELECT COUNT(*) FROM follows AS f WHERE f.follower_id = u.id), 0) AS following,
      CASE
        WHEN u.id = $2 OR $2 IS NULL THEN NULL
        ELSE JSON_BUILD_OBJECT(
          'isFollowing', EXISTS(SELECT 1 FROM follows AS f WHERE f.follower_id = $2 AND f.following_id = u.id),
          'isFollowedBy', EXISTS(SELECT 1 FROM follows AS f WHERE f.follower_id = u.id AND f.following_id = $2)
        )
      END AS "userMeta"
      FROM users AS u
      WHERE u.username = $1;`,
      [username, sessionID]
    );

    if (!result.rowCount) throw new NotFoundError(`Usuario '${username}' no encontrado.`);

    return result.rows[0] as UserPublicProfile;
  }

  static async getUserInfo(action: FindUserBy): Promise<UserEditableInfo> {
    const { type } = action;
    const user = type === 'id'
      ? await db.query('SELECT id, name, avatar, cover, bio, location, website FROM users WHERE id = $1;', [action.userID])
      : await db.query('SELECT id, name, avatar, cover, bio, location, website FROM users WHERE username = $1;', [action.username]);

    if (!user.rowCount) throw new NotFoundError('User not found');

    return user.rows[0];
  }

  static async getSuggestions({ sessionID, page }: GetSuggestionsParams): Promise<UserCard[]> {
    const offset = 10 * (page - 1);

    const result = await db.query(
      `SELECT
        u.id,
        u.name,
        u.username,
        u.avatar,
        u.bio,
        JSON_BUILD_OBJECT(
          'isFollowing', FALSE,
          'isFollowedBy', EXISTS(SELECT 1 FROM follows AS f WHERE f.follower_id = u.id AND f.following_id = $1)
        ) AS "userMeta"
      FROM users AS u
      LEFT JOIN follows AS f
        ON f.follower_id = $1 AND f.following_id = u.id
      WHERE u.id != $1 AND f.follower_id IS NULL
      LIMIT 10 OFFSET $2;`
      , [sessionID, offset]);

    return result.rows;
  }

  static async getUserFollows({ userID, type, sessionID }: GetFollowsParams): Promise<UserCard[]> {
    // following es para conocer a los usuarios que sigue el usuario del id
    const followType = type === 'following' ? 'following_id' : 'follower_id';
    const target = type === 'following' ? 'follower_id' : 'following_id';
    const includeUserMeta = sessionID != null;

    const userMetaSelect =
      `JSON_BUILD_OBJECT(
        'isFollowing', ${includeUserMeta ? 'EXISTS(SELECT 1 FROM follows AS f WHERE f.follower_id = $2 AND f.following_id = u.id)' : 'FALSE'},
        'isFollowedBy', ${includeUserMeta ? 'EXISTS(SELECT 1 FROM follows AS f WHERE f.follower_id = u.id AND f.following_id = $2)' : 'FALSE'}
      )`;

    const queryParams = [userID];
    if (sessionID) queryParams.push(sessionID);

    const result = await db.query(
      `SELECT
        u.id,
        u.name,
        u.username,
        u.avatar,
        u.bio,
        ${userMetaSelect} AS "userMeta"
      FROM users AS u
      JOIN follows AS f
        ON f.${followType} = u.id
      WHERE f.${target} = $1
      LIMIT 30;`,
      queryParams
    );

    return result.rows;
  }

  static async existUser({ username }: { username: UsernameType }): Promise<UserBasic> {
    const result = await db.query('SELECT id, name, username, avatar, bio FROM users WHERE LOWER(username) = $1;', [username]);

    if (!result.rowCount) throw new NotFoundError(`Usuario '${username}' no encontrado.`);
    return result.rows[0];
  }

  static async updateUser({ id, name, bio, location, website, avatar, cover }: UserEditableInfo): Promise<void> {
    const result = await db.query(
      `UPDATE users SET
        name = $1,
        avatar = $2,
        cover = $3,
        bio = $4,
        location = $5,
        website = $6
      WHERE id = $7
      RETURNING *;`,
      [name, avatar, cover, bio, location, website, id]
    );

    return result.rows[0];
  }
}
