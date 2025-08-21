import type {
  TweetIDType,
  ParentTweetIDType,
  ContentType,
  ImageUrlType,
  CreatedAtType,
  UserIDType,
  NameType,
  UsernameType,
  AvatarType,
  SessionID
} from './types.d';

import type { UserBasic } from './users.d';

interface TweetUserMeta {
  likedByUser: boolean;
  retweetedByUser: boolean;
  bookmarkedByUser: boolean;
}

export interface Tweet {
  id: TweetIDType;
  user: UserBasic;
  parentTweetID: ParentTweetIDType;
  content: ContentType;
  imageUrl: ImageUrlType;
  createdAt: CreatedAtType;
  deleted: boolean;
  comments: number;
  retweets: number;
  likes: number;
  userMeta: TweetUserMeta;
}

export interface DeletedTweet extends Tweet {
  user: null;
  content: null;
  imageUrl: null;
  createdAt: null;
}

export interface CreateTweet {
  userID: UserIDType;
  content: ContentType;
  imageUrl: ImageUrlType;
  parentTweetID: ParentTweetIDType;
}

export type GetFeedParams = { sessionID: SessionID; page: number; following: boolean | undefined; };
export type GetTweetParams = { sessionID: SessionID, tweetID: TweetIDType };
export type GetTweetCommentsParams = { sessionID: SessionID, tweetID: TweetIDType, page: number };
export type GetTweetsAboutUserParams = { userID: UserIDType, page: number, sessionID: SessionID };
export type GetTweetsByUser = GetTweetsAboutUserParams & { multimedia?: boolean };
export type GetTweetsReactedByUser = Omit<GetTweetsAboutUserParams, 'userID'>;
export type GetRepliesIDs = { userID: UserIDType, page: number };

export interface GetTweetsBase {
  sessionID: SessionID,
  offset: number,
  extraWhere?: string,
  extraJoin?: string,
  orderBy?: string;
  extraParams?: unknown[],
  isLiked?: boolean,
  isBookmarked?: boolean
}

export type RepliesType = { status: Tweet, thread: (Tweet | DeletedTweet)[] }[];

export interface TweetsModelType {
  getTweets(params: GetFeedParams): Promise<Tweet[]>;
  getThreadById(params: GetTweetParams): Promise<(Tweet | DeletedTweet)[]>;
  getRepliesIDs(params: GetRepliesIDs): Promise<{ id: UserIDType }[]>;
  getTweetComments(params: GetTweetCommentsParams): Promise<Tweet[]>;

  getTweetsByUser(params: GetTweetsByUser): Promise<Tweet[]>;
  getLikedTweetsByUser(params: GetTweetsReactedByUser): Promise<Tweet[]>;
  getBookmarkedTweetsByUser(params: GetTweetsReactedByUser): Promise<Tweet[]>;

  createTweet(input: CreateTweet): Promise<TweetIDType>;
  deleteTweet(params: GetTweetParams): Promise<ImageUrlType>;
}
