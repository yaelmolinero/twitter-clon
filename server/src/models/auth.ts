import * as db from '../config/db';
import { NotFoundError } from '../utils/customErrors';

import type { CreateUserParams, GetUserQuery, UserCredentials, RefreshTokenParams, RefreshToken } from '../types/auth.d';
import type { UserBasic } from '../types/users.d';
import type { UserIDType } from '../types/types.d';

export class AuthModel {
  static async getUser({ type, data }: GetUserQuery): Promise<UserCredentials> {
    const searchBy = type === 'email' ? 'email' : 'username';

    const res = await db.query(`SELECT id, name, username, password, avatar, bio FROM users WHERE ${searchBy} = $1;`, [data]);
    if (!res.rowCount) throw new NotFoundError('Usuario no encontrado');

    return res.rows[0] as UserCredentials;
  }

  static async existUser({ type, data }: GetUserQuery): Promise<boolean> {
    const searchBy = type === 'email' ? 'email' : 'username';

    const res = await db.query(`SELECT username FROM users WHERE LOWER(${searchBy}) = $1;`, [data]);
    return Boolean(res.rowCount);
  }

  static async createUser({ name, username, email, password }: CreateUserParams): Promise<UserBasic> {
    const res = await db.query(
      'INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, username;',
      [name, username, email, password]
    );
    const user: UserBasic = { ...res.rows[0], avatar: null, bio: null };
    return user;
  }

  static async getRefreshToken(userID: UserIDType): Promise<RefreshToken | undefined> {
    const result = await db.query('SELECT user_id, token_hash FROM refresh_tokens WHERE user_id = $1 AND revoke IS FALSE AND expires_at > NOW();', [userID]);
    if (!result.rowCount) return undefined;

    const user = await db.query(
      'SELECT id, name, username, avatar, bio FROM users WHERE id = $1;',
      [result.rows[0].user_id]
    );

    const { id, name, username, avatar, bio }: UserBasic = user.rows[0];
    const tokenHash = result.rows[0].token_hash;

    return { id, name, username, avatar, bio, tokenHash };
  }

  static async createRefreshToken({ userID, tokenHash, expiresAt }: RefreshTokenParams) {
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3);',
      [userID, tokenHash, expiresAt]
    );
  }

  static async updateRefreshToken({ userID, tokenHash, expiresAt }: RefreshTokenParams): Promise<boolean> {
    // No existe el token o ya esta caducado
    const result = await db.query('SELECT user_id FROM refresh_tokens WHERE user_id = $1 AND revoke IS FALSE;', [userID]);
    if (!result.rowCount) return false;

    // Actualiza el token
    await db.query('UPDATE refresh_tokens SET token_hash = $1, expires_at = $2 WHERE user_id = $3;', [tokenHash, expiresAt, userID]);
    return true;
  }

  static async revokeRefreshToken(userID: UserIDType) {
    await db.query('UPDATE refresh_tokens SET revoke = TRUE WHERE user_id = $1;', [userID]);
  }
}
