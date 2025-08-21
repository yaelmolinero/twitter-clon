import { useInfiniteQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useAuth.ts';
import { useParams } from 'react-router';
import { api } from '@/lib/api-client.ts';
import type { ApiUserReplies } from '@/types/api.d.ts';

export function useUserReplies() {
  const { session } = useUser();
  const { username } = useParams();

  const { data, isLoading, isError, isRefetching, isFetchingNextPage, hasNextPage, refetch, fetchNextPage } = useInfiniteQuery({
    queryKey: ['replies', username],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      const result = await api.get<ApiUserReplies>(`/users/${username}/replies`, { auth: session?.token, params: { page: pageParam } });
      const { replies } = result;
      const nextCursor = replies.length === 5 ? pageParam + 1 : undefined;
      return { replies, nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5
  });

  const replies = data?.pages.flatMap(page => page.replies) ?? [];

  return {
    replies,
    isLoading,
    isError,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage
  };
}
