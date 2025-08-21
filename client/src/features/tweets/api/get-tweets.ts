import { api } from '@/lib/api-client.ts';

import type { TweetApi, ApiTweetsResponse } from '@/types/api.d.ts';
import type { UseInfiniteTweetsProps } from '@/types/tweets.d.ts';

interface FetchingTweetsParams extends UseInfiniteTweetsProps {
  page: number;
  auth?: string;
}

export async function getTweets({ type, page, auth, username, tweetID, query, onlyImages }: FetchingTweetsParams): Promise<TweetApi[]> {
  const params: { [key: string]: unknown } = { page };
  let endpoint;

  if (type === 'foryou' || type === 'following') {
    endpoint = '/tweets';
    if (type === 'following') params['following'] = 'true';
  }
  else if (type === 'postedBy' || type === 'multimediaBy') {
    endpoint = `/users/${username}/tweets`;
    params['multimedia'] = type === 'multimediaBy';
  }
  else if (type === 'comments') endpoint = `/tweets/${tweetID}/comments`;
  else if (type === 'likedByUser') endpoint = '/users/me/likes';
  else if (type === 'bookmarkedByUser') endpoint = '/users/me/bookmarks';
  else if (type === 'query') {
    endpoint = '/search';
    params['query'] = query ?? '';
    params['filter'] = onlyImages ? 'media' : 'post';
  }

  if (!endpoint) throw new Error('No se especifico el endpoint');

  console.log(`Consultando ${type}...`);
  const data = await api.get<ApiTweetsResponse>(endpoint, { auth, params });
  return data.tweets;
}
