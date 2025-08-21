import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { api } from '@/lib/api-client.ts';

import type { UserPublicProfileApi } from '@/types/api.d.ts';
import type { UserBasic } from '@/types/users.d.ts';

async function getProfile({ username, token }: { username: string, token?: string }) {
  return await api.get<UserPublicProfileApi>(`/users/${username}`, { auth: token });
}

export function useProfile({ username }: { username: string }) {
  const { session } = useUser();

  const location = useLocation();
  const placeholder = (location.state as { user?: UserBasic })?.user;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfile({ username, token: session?.token }),
    staleTime: 1000 * 60 * 5
  });

  const userBasic = {
    id: data?.id ?? '',
    name: data?.name ?? placeholder?.name ?? 'Perfil',
    username: data?.username ?? placeholder?.username ?? 'username',
    avatar: data?.avatar ?? placeholder?.avatar ?? null,
    bio: data?.bio ?? placeholder?.bio ?? null
  };

  return {
    data,
    isLoading,
    isError,
    hasPrevData: placeholder != undefined,
    userBasic
  };
}
