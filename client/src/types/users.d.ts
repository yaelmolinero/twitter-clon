import type {
  UserIDType,
  NameType,
  UsernameType,
  EmailType,
  AvatarType,
  CoverType,
  BioType,
  LocationType,
  WebsiteType,
  CreatedAtType
} from '@/types/types.d.ts';

import type { InfiniteData } from '@tanstack/react-query';
import type { UserMetaFollow } from '@/types/api.d.ts';

export interface UserBasic {
  id: UserIDType;
  name: NameType;
  username: UsernameType;
  avatar: AvatarType;
  bio: BioType;
}

export interface UserCard extends UserBasic {
  userMeta: UserMetaFollow;
}

export enum ROLES {
  USER = 'USER',
  GUEST = 'GUEST'
}

type RolesType = keyof typeof ROLES;

export type User =
  | { user: UserBasic, token: string, role: ROLES.USER }
  | { user: undefined, token: undefined, role: ROLES.GUEST }

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
  followers: number;
  following: number;
  userMeta: UserMetaFollow;
}

export interface UserEditableState {
  id: UserIDType;
  name: NameType;
  bio: BioType;
  location: LocationType;
  website: WebsiteType;
  avatar: AvatarType;
  cover: CoverType;

  newAvatarFile?: File;
  newCoverFile?: File;
  removeCover?: boolean;
}

export type EditProfileRenders = 'general' | 'avatar' | 'cover';
export type ToUploadType = Exclude<EditProfileRenders, 'general'>;

export type InfinityUsersData = InfiniteData<{ users: UserCard[], nextCursor?: number }>;
