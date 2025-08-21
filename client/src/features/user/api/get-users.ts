import { useInfiniteQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useAuth.ts';
import { api } from '@/lib/api-client.ts';

import type { ApiUserCardResponse } from '@/types/api.d.ts';

interface FetchParams {
  token: string;
  page: number;
  query?: string;
}

async function getSuggestions({ token, page, query }: FetchParams) {
  if (!query) return await api.get<ApiUserCardResponse>('/users/suggestions', { auth: token, params: { page } });
  return await api.get<ApiUserCardResponse>('/search', { auth: token, params: { page, query, filter: 'user' } });
}

interface Props {
  type: 'suggestions' | 'query',
  query?: string;
}

export function useSuggestions({ type, query }: Props) {
  const isSuggestion = type === 'suggestions';
  const { session } = useUser();

  const { data, isLoading, isError, isRefetching, hasNextPage, isFetchingNextPage, refetch, fetchNextPage } = useInfiniteQuery({
    queryKey: ['users', type, query],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      if (!session?.token) throw Error('Necesita estar autenticado');

      const { users } = await getSuggestions({ token: session.token, page: pageParam, query });
      const nextCursor = users.length === 10 ? pageParam + 1 : undefined;

      return { users, nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: isSuggestion ? 1000 * 60 * 15 : undefined
  });

  const users = data?.pages.flatMap(page => page.users) ?? [];

  return {
    users,
    isLoading,
    isError,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage
  };
}
