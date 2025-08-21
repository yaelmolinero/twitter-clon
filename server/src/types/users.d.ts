import type {
  UserIDType,
  NameType,
  UsernameType,
  EmailType,
  PasswordType,
  AvatarType,
  CoverType,
  BioType,
  LocationType,
  WebsiteType,
  CreatedAtType,
  FollowersType,
  FollowingType,
  TweetIDType,
  UserIDType,
  ParentTweetIDType,
  ContentType,
  ImageUrlType,
  SessionID,
  SessionIDRequeried
} from './types.d';

import { ZUpdateUser } from '../schemas/users';

export interface UserBasic {
  id: UserIDType;
  name: NameType;
  username: UsernameType;
  avatar: AvatarType;
  bio: BioType;
}

interface UserMeta {
  isFollowing: boolean;   // Si la cuenta de la sesion sigue al usuario
  isFollowedBy: boolean;  // Si el usuario sigue a la cuenta de la sesion
}

export interface UserCard extends UserBasic {
  userMeta: UserMeta;
}

export interface UserPublicProfile {
  id: UserIDType;
  name: NameType;
  username: UsernameType;
  avatar: AvatarType;
  cover: CoverType;
  bio: BioType;
  location: LocationType;
  website: WebsiteType;
  createdAt: CreatedAtType;
  followers: FollowersType;
  following: FollowingType;
  isSessionAcount: boolean;
  userMeta: UserMeta | null;
}

// Informacion del usuario para actualizar
export interface UserEditableInfo {
  id: UserIDType;
  name: NameType;
  avatar: AvatarType;
  cover: CoverType;
  bio: BioType;
  location: LocationType;
  website: WebsiteType;
}

export type FindUserBy =
  | { type: 'id', userID: UserIDType; }
  | { type: 'username', username: UsernameType; }

export type GetFollowsParams = { userID: UserIDType, type: 'followers' | 'following', sessionID: SessionID };
export type GetUserParams = { username: UsernameType, sessionID: SessionID };
export type GetSuggestionsParams = { sessionID: SessionIDRequeried, page: number };

export interface UserModelType {
  getUser(params: GetUserParams): Promise<UserPublicProfile>;
  getUserInfo(action: FindUserBy): Promise<UserEditableInfo>;
  getSuggestions(params: GetSuggestionsParams): Promise<UserCard[]>;
  getUserFollows(params: GetFollowsParams): Promise<UserCard[]>;
  existUser({ username }: { username: UsernameType }): Promise<UserBasic>;
  updateUser(params: UserEditableInfo): Promise<void>;
}
