import type {
  UserIDType,
  NameType,
  UsernameType,
  AvatarType,
  CoverType,
  BioType,
  LocationType,
  WebsiteType,

  TweetIDType,
  ParentTweetIDType,
  ContentType,
  ImageUrlType,
  CreatedAtType
} from '@/types/types.d.ts';
import type { UserBasic } from '@/types/users.d.ts';

// Autenticacion
export interface AccessToken {
  user: UserBasic;
  token: string;
}

// Tweets
export type UserMetaTweet = {
  likedByUser: boolean;
  retweetedByUser: boolean;
  bookmarkedByUser: boolean;
};

export interface TweetApi {
  id: UserIDType;
  user: UserBasic;
  parentTweetID: ParentTweetIDType;
  content: ContentType;
  imageUrl: ImageUrlType;
  createdAt: CreatedAtType;
  deleted: boolean;
  comments: number;
  retweets: number;
  likes: number;
  userMeta: UserMetaTweet;
}

export interface ApiTweetsResponse {
  tweets: TweetApi[];
}

export interface ApiTweetCreatedResponse {
  id: TweetIDType,
  user: UserBasic;
  parentTweetID: ParentTweetIDType;
  content: ContentType;
  imageUrl: ImageUrlType;
  createdAt: CreatedAtType;
}

interface StatusTweet extends TweetApi {
  userMetaFollow: UserMetaFollow;
}

export interface ApiThreadResponse {
  status: StatusTweet;
  thread: StatusTweet[];
}

export interface ReplyThread {
  status: TweetApi;
  thread: TweetApi[];
}

export interface ApiUserReplies {
  replies: ReplyThread[];
}

// Usuarios
interface UserMetaFollow {
  isFollowing: boolean;   // Si la cuenta de la sesion sigue al usuario
  isFollowedBy: boolean;  // Si el usuario sigue a la cuenta de la sesion
}

export interface UserPublicProfileApi {
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
  isSessionAcount: boolean;
  userMeta: UserMetaFollow | null;
}

export interface ApiUserEditedResponse {
  message: string;
  user: {
    id: UserIDType;
    name: NameType;
    avatar: AvatarType;
    cover: CoverType;
    bio: BioType;
    location: LocationType;
    website: WebsiteType;
  }
}

export interface UserCardApi extends UserBasic {
  userMeta: UserMetaFollow;
}

export interface ApiUserCardResponse {
  users: UserCardApi[];
}

// Notificaciones
export type ApiNotificationType =
  | { id: string, type: 'comment', sender: UserBasic, tweet: Tweet, checked: boolean }
  | { id: string, type: 'follow', sender: UserBasic, tweet: null, checked: boolean }
  | { id: string, type: 'like' | 'retweet', sender: UserBasic, tweet: TweetForNotification, checked: boolean }

// Query
export interface ApiQueryResult {
  tweets: TweetApi[];
  users: UserCardApi[];
}

// Follows
export interface ApiUserFollows {
  profile: {
    id: UserIDType;
    name: NameType;
    username: string;
  },
  users: UserCardApi[];
}
