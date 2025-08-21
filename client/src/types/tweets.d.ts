import type {
  TweetIDType,
  ParentTweetIDType,
  ContentType,
  ImageUrlType,
  CreatedAtType,
  UsernameType,
} from '@/types/types.d.ts';
import type { InfiniteData } from '@tanstack/react-query';

import type { UserBasic } from '@/types/users.d.ts';
import type { UserMetaTweet, UserMetaFollow, ReplyThread } from '@/types/api.d.ts';

export type TweetVariant = 'normal' | 'thread' | 'focused' | 'replying';

export interface TweetType {
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
  userMeta: UserMetaTweet;
}

export interface StatusType extends TweetType {
  userMetaFollow: UserMetaFollow;
}

export interface UseInfiniteTweetsProps {
  type: 'foryou' | 'following' | 'comments' | 'query' | 'postedBy' | 'multimediaBy' | 'likedByUser' | 'bookmarkedByUser';
  cacheMinutes?: number;
  username?: UsernameType;
  tweetID?: TweetIDType;
  query?: string;
  onlyImages?: boolean;
}

export interface NewPostState {
  content: ContentType;
  image: ImageUrlType;
  file: File | undefined;
}

export interface NewTweetInThread extends NewPostState {
  isFocused: boolean;
}

export type InfinityTweetsData = InfiniteData<{ tweets: TweetType[], nextCursor?: number }>;
export type InfinityRepliesData = InfiniteData<{ replies: ReplyThread[], nextCursor?: number }>;
