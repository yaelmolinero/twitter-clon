import type {
  UserIDType,
  NameType,
  UsernameType,
  AvatarType,
  CreatedAtType,
  TweetIDType,
  ContentType,
  ImageUrlType
} from './types.d.ts';

import type { TweetType } from '@/types/tweets.d.ts';
import type { UserBasic } from '@/types/users.d.ts';

type NotificationVariant = 'comment' | 'follow' | 'like' | 'retweet';

interface TweetForNotification {
  id: TweetIDType;
  content: ContentType;
  imageUrl: ImageUrlType;
}

export type NotificationType =
  | { id: string, type: 'comment', sender: UserBasic, tweet: TweetType, checked: boolean }
  | { id: string, type: 'follow', sender: UserBasic, tweet: null, checked: boolean }
  | { id: string, type: 'like' | 'retweet', sender: UserBasic, tweet: TweetForNotification, checked: boolean }
