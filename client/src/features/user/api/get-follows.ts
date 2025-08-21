import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { api } from '@/lib/api-client.ts';

import type { ApiUserFollows } from '@/types/api.d.ts';

export function useFollows({ type }: { type: 'followers' | 'following' }) {
  const { username } = useParams();
  const { session } = useUser();

  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ['follows', type, username],
    queryFn: async () => await api.get<ApiUserFollows>(`/users/${username}/${type}`, { auth: session?.token })
  });

  return {
    users: data?.users,
    profile: data?.profile,
    isLoading,
    isError,
    isRefetching,
    refetch
  };
}
