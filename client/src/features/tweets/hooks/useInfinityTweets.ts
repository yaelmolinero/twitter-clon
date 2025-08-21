import { useInfiniteQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useAuth.ts';
import { getTweets } from '../api/get-tweets.ts';
import type { UseInfiniteTweetsProps } from '@/types/tweets.d.ts';

export function useInfinityTweets(params: UseInfiniteTweetsProps) {
  const { session } = useUser();
  const { type, cacheMinutes, ...queryKeyParams } = params;

  const { data, isLoading, isError, isRefetching, hasNextPage, isFetchingNextPage, refetch, fetchNextPage } = useInfiniteQuery({
    queryKey: ['tweets', type, queryKeyParams],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      const tweets = await getTweets({ ...params, page: pageParam, auth: session?.token });
      const nextCursor = tweets.length === 10 ? pageParam + 1 : undefined;
      return { tweets, nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    retry: false,
    refetchOnWindowFocus: false,
    // staleTime: cacheMinutes ? 1000 * 60 * cacheMinutes : undefined
    staleTime: type === 'foryou' || type === 'following' ? 1000 * 60 * 30
      : cacheMinutes ? 1000 * 60 * cacheMinutes : undefined
  });

  const tweets = data?.pages.flatMap(page => page.tweets) ?? [];

  return {
    tweets,
    isLoading,
    isError,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
  };
}
