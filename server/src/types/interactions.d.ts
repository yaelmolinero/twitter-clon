import type {
  UserIDType,
  UsernameType,
  AvatarType,
  BioType,
  TweetIDType,
  ContentType,
  ImageUrlType,
  CreatedAtType,
  SessionIDRequeried
} from './types.d';

import type { Tweet } from '../types/tweets.d';
import type { UserBasic, UserCard } from '../types/users.d';

type NotificationVariant = 'comment' | 'follow' | 'like' | 'retweet';

interface TweetForNotification {
  id: TweetIDType;
  content: ContentType;
  imageUrl: ImageUrlType;
}

export interface NotificationQuery {
  senderID: UserIDType;
  recipientID: UserIDType;
  type: NotificationVariant;
  tweetID: TweetIDType | null;
}

export type NotificationType =
  | { id: string, type: 'comment', sender: UserBasic, tweet: Omit<Tweet, 'user'>, checked: boolean }
  | { id: string, type: 'follow', sender: UserBasic, tweet: null, checked: boolean }
  | { id: string, type: 'like' | 'retweet', sender: UserBasic, tweet: TweetForNotification, checked: boolean }

export interface NotificationsModelType {
  getUserNotifications(sessionID: UserIDType): Promise<NotificationType[]>;
  createNotification(input: NotificationQuery): Promise<void>;
  setNotificationCheck(id: string): Promise<void>;
  deleteNotification(input: NotificationQuery): Promise<void>;
}

export type FollowsQuery = { followerID: UserIDType, userToFollowID: UserIDType };

export type QueryParams = { query: string, page: number, sessionID: SessionIDRequeried }
export type QueryTweetParams = (QueryParams & { newest?: boolean, onlyImages?: boolean })

export interface QueryModelType {
  searchTweets(input: QueryTweetParams): Promise<Tweet[]>;
  searchUsers(input: QueryParams): Promise<UserCard[]>;
}

export type InteractionQuery = { userID: UserIDType, tweetID: TweetIDType };

export interface LikesModelType {
  createLike(input: InteractionQuery): Promise<void>;
  removeLike(input: InteractionQuery): Promise<void>;
}

export interface RetweetsModelType {
  createRetweet(input: InteractionQuery): Promise<void>;
  removeRetweet(input: InteractionQuery): Promise<void>;
}

export interface BookmarksModelType {
  createBookmark(input: InteractionQuery): Promise<void>;
  removeBookmark(input: InteractionQuery): Promise<void>;
}

export interface FollowsModelType {
  startFollowing(input: FollowsQuery): Promise<void>;
  stopFollowing(input: FollowsQuery): Promise<void>;
}
