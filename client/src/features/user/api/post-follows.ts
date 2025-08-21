import { useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client.ts';

import type { InfinityUsersData, UserPublicProfile } from '@/types/users.d.ts';
import type { UserIDType } from '@/types/types.d.ts';
import type { ApiUserFollows } from '@/types/api.d.ts';

type FetchParams = { userID: UserIDType, token: string };

async function fetchFollow({ userID, token, isFollowing }: FetchParams & { isFollowing: boolean }): Promise<void> {
  if (isFollowing) return await api.delete(`/follows/${userID}`, { auth: token });
  return await api.post(`/follows/${userID}`, undefined, { auth: token });
}

export function useFollow() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: fetchFollow,
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        predicate: ({ queryKey }) => queryKey[0] === 'users' || queryKey[0] === 'profile'
      });

      const { userID, isFollowing } = data;
      const prevUsersData = queryClient.getQueriesData<InfinityUsersData>({ queryKey: ['users'] });

      queryClient.setQueriesData<InfinityUsersData>({ queryKey: ['users'] },
        (oldData) => {
          if (!oldData) return oldData;
          const { pageParams, pages } = oldData;

          return {
            pageParams,
            pages: pages.map(({ users, nextCursor }) => ({
              nextCursor,
              users: users.map((user) => user.id === userID ? { ...user, userMeta: { ...user.userMeta, isFollowing: !isFollowing } } : user)
            }))
          };
        }
      );

      const prevProfileData = queryClient.getQueriesData<UserPublicProfile>({ queryKey: ['profile'] });
      queryClient.setQueriesData<UserPublicProfile>({ queryKey: ['profile'], type: 'active' },
        (oldData) => {
          if (!oldData) return oldData;
          return { ...oldData, userMeta: { ...oldData.userMeta, isFollowing: !isFollowing } };
        }
      );

      const prevFollowsData = queryClient.getQueriesData<ApiUserFollows>({ queryKey: ['follows'], type: 'active' });
      queryClient.setQueriesData<ApiUserFollows>({ queryKey: ['follows'], type: 'active' },
        (oldData) => {
          if (!oldData) return oldData;
          const { users, profile } = oldData;

          return {
            profile,
            users: users.map((user) => user.id === userID ? { ...user, userMeta: { ...user.userMeta, isFollowing: !isFollowing } } : user)
          };
        }
      );

      return { prevUsersData, prevProfileData, prevFollowsData };
    },
    onError: (err, _, context) => {
      console.error(err);

      if (context == undefined) return;
      const prevData = Object.values(context);

      prevData.forEach(prev => {
        prev.forEach(query => {
          const [queryKey, oldData] = query;
          if (oldData) queryClient.setQueryData(queryKey, oldData);
        });
      });
    },
    onSuccess: (_, { userID, token, isFollowing }) => {
      if (isFollowing) return;

      api.post('/notifications', {
        type: 'follow',
        recipientID: userID,
        tweetID: 'null'
      }, { auth: token })
        .then(() => console.log('Notificacion enviada!'))
        .catch(err => console.error(err));
    }
  });

  return { mutate, isPending };
}
