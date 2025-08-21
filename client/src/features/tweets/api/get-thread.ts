import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useAuth.ts';
import { usePageTitle } from '@/hooks/usePageTitle.ts';
import { api } from '@/lib/api-client.ts';

import type { ApiThreadResponse } from '@/types/api.d.ts';
import type { StatusType } from '@/types/tweets.d.ts';
import type { UserCard } from '@/types/users.d.ts';

export function useThread() {
  const { tweetID } = useParams();
  const { session, isUserAuthenticated } = useUser();

  const location = useLocation();
  const statusFromState = (location.state as { status?: StatusType })?.status;

  const { data, isError, isLoading } = useQuery({
    queryKey: ['thread', tweetID],
    queryFn: async () => await api.get<ApiThreadResponse>(`/tweets/${tweetID}`, { auth: session?.token })
  });

  const [status, setStatus] = useState<StatusType | null>(null);
  const [thread, setThread] = useState<StatusType[]>([]);
  const [relevantUsers, setRelevantUsers] = useState<UserCard[]>([]);

  useEffect(() => {
    if (!data) return setStatus(null);

    const { status, thread } = data;
    const relevantUsersMap = {
      [status.user.id]: { ...status.user, userMeta: status.userMetaFollow },
    };

    thread.forEach(({ deleted, user, userMetaFollow }) => {
      if (deleted) return;

      const userID = user.id;
      const existUser = relevantUsersMap[userID] !== undefined;

      if (!existUser) relevantUsersMap[userID] = { ...user, userMeta: userMetaFollow };
    });

    const relevantUsers = Object.values(relevantUsersMap);
    setStatus(status);
    setThread(thread);
    setRelevantUsers(relevantUsers);

  }, [data]);

  const pageTitle = !status
    ? 'Post no encontrado - Twitter Clon'
    : `${status.user.name} en Twitter: '@${status.user.username} ${status.content} ${status.imageUrl ?? ''}'`;

  usePageTitle(pageTitle);

  return {
    status: status ?? statusFromState,
    thread,
    relevantUsers,
    isUserAuthenticated,
    isError,
    isLoading
  };
}
