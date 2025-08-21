import type { Request } from 'express';

import type {
  UserIDType,
  NameType,
  UsernameType,
  EmailType,
  PasswordType,
  AvatarType,
  BioType
} from './types.d';

import type { UserBasic } from './users.d';

export interface UserCredentials extends UserBasic {
  email: EmailType;
  password: PasswordType;
}

export type GetUserQuery = {
  type: 'email' | 'username';
  data: string;
}

export interface CreateUserParams {
  name: NameType;
  username: UsernameType;
  email: EmailType;
  password: PasswordType;
}

export type LoginUserParams = (GetUserQuery & { password: PasswordType });

export interface RefreshToken extends UserBasic {
  tokenHash: string;
}

export interface RefreshTokenParams {
  userID: UserIDType;
  tokenHash: string;
  expiresAt: string;
}

interface AuthRequest extends Request {
  session?: {
    user: UserBasic;
  }
}

export interface AuthModelType {
  existUser(action: GetUserQuery): Promise<boolean>;
  getUser(action: GetUserQuery): Promise<UserCredentials>;
  createUser({ name, username, email, password }: CreateUserParams): Promise<UserBasic>;

  getRefreshToken(userID: UserIDType): Promise<RefreshToken | undefined>;
  createRefreshToken({ userID, tokenHash, expiresAt }: RefreshTokenParams): Promise<void>;
  updateRefreshToken({ userID, tokenHash, expiresAt }: RefreshTokenParams): Promise<boolean>;
  revokeRefreshToken(userID: UserIDType): Promise<void>;
}
