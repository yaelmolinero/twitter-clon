import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { api } from '@/lib/api-client';
import { paths } from '@/config/paths.ts';

import type { TweetIDType, UserIDType } from '@/types/types.d.ts';
import type { InfinityRepliesData, InfinityTweetsData } from '@/types/tweets.d.ts';
import type { ApiThreadResponse } from '@/types/api.d.ts';

async function deleteTweet({ tweetID, token }: { tweetID: TweetIDType, token: string }) {
  await api.delete(`/tweets/${tweetID}`, { auth: token });
}

export function useDelete({ tweetID, userID }: { tweetID: TweetIDType, userID: UserIDType }) {
  const { session } = useUser();
  const [showOptions, setShowOptions] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: deleteTweet,
    onMutate: async ({ tweetID }) => {
      //
      const previousData = queryClient.getQueriesData<InfinityTweetsData>({ queryKey: ['tweets'] });

      queryClient.setQueriesData<InfinityTweetsData>({ queryKey: ['tweets'] }, (oldPagesArray) => {
        if (!oldPagesArray) return oldPagesArray;
        const filteredTweets = structuredClone(oldPagesArray);

        filteredTweets.pages = filteredTweets.pages.map(page => ({
          nextCursor: page.nextCursor,
          tweets: page.tweets.map(tw => tw.id === tweetID ? { ...tw, deleted: true } : tw),
        }));

        return filteredTweets;
      });

      //
      const prevThread = queryClient.getQueriesData<ApiThreadResponse>({ queryKey: ['thread'], type: 'active' });

      queryClient.setQueriesData<ApiThreadResponse>({ queryKey: ['thread'], type: 'active' },
        (oldData) => {
          if (oldData == undefined) return oldData;

          const { status, thread } = oldData;
          if (tweetID === status.id) return { status: { ...status, deleted: true }, thread };

          return {
            status,
            thread: thread.map(tw => tw.id !== tweetID ? tw : { ...tw, deleted: true })
          };
        });

      //
      const prevUserReplies = queryClient.getQueriesData<InfinityRepliesData>({ queryKey: ['replies'], type: 'active' });

      queryClient.setQueriesData<InfinityRepliesData>({ queryKey: ['replies'], type: 'active' },
        (oldData) => {
          if (oldData == undefined) return oldData;

          const { pageParams, pages } = oldData;
          return {
            pageParams,
            pages: pages.map(({ replies, nextCursor }) => ({
              nextCursor,
              replies: replies.map(({ status, thread }) => {
                if (tweetID === status.id) return { status: { ...status, deleted: true }, thread };
                return { status, thread: thread.map(tw => tw.id !== tweetID ? tw : { ...tw, deleted: true }) };
              })
            }))
          };
        });

      return { previousData, prevThread, prevUserReplies };
    },
    onError: (err, _, context) => {
      console.error(err);
      if (!context) return;

      const prevData = Object.values(context);

      prevData.forEach(prev => {
        prev.forEach(query => {
          const [queryKey, oldData] = query;
          if (oldData) queryClient.setQueryData(queryKey, oldData);
        });
      });
    },
    onSuccess: () => {
      console.log('Tweet eliminado');

      const isStatusDeleted = queryClient.getQueriesData<ApiThreadResponse>({
        queryKey: ['thread', tweetID],
        exact: true,
        type: 'active'
      });
      if (isStatusDeleted.length > 0) return navigate(paths.app.home.getHref(), { replace: true });
    }
  });

  useEffect(() => {
    function closeOptions() {
      setShowOptions(false);
    }
    if (showOptions) {
      window.addEventListener('click', closeOptions);
      document.documentElement.classList.add('pointer-events-none');
    } else {
      window.removeEventListener('click', closeOptions);
      document.documentElement.classList.remove('pointer-events-none');
    }

    return () => {
      window.removeEventListener('click', closeOptions);
      document.documentElement.classList.remove('pointer-events-none');
    };

  }, [showOptions]);

  function handleShowOptions(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();

    if (!session?.user || session.user.id !== userID) return;
    setShowOptions(true);
  }

  function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();

    if (!session?.user || session.user.id !== userID) return;
    setShowOptions(false);
    mutate({ tweetID, token: session.token });
  }

  return {
    showOptions,
    handleShowOptions,
    handleDelete
  };
}
