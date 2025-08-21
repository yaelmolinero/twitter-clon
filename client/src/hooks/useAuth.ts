import { useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client.ts';

import { getRefreshToken } from '@/features/auth/api/refreshToken.ts';

export function useUser() {
  const { data, isLoading, isError, isStale, refetch } = useQuery({
    queryKey: ['auth'],
    queryFn: getRefreshToken,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,     // Access token valido durante 1h
    retry: false
  });

  const isUserAuthenticated = data !== undefined && data.user != null;
  return { session: data, isUserAuthenticated, isLoading, isError, isStale, refetch };
}

export function useLogout() {
  const queryClient = useQueryClient();

  async function logout() {
    api.post('/auth/logout', undefined, { credentials: 'include' })
      .then(() => queryClient.removeQueries({ queryKey: ['auth'] }));
  }

  return { logout };
}
