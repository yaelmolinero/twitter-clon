import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { api } from '@/lib/api-client.ts';
import { paths } from '@/config/paths.ts';

import type { InfinityTweetsData, TweetType, InfinityRepliesData } from '@/types/tweets.d.ts';
import type { ApiThreadResponse, StatusTweet, ApiNotificationType } from '@/types/api.d.ts';
import type { TweetIDType } from '@/types/types.d.ts';

type InteractionType = 'retweets' | 'likes' | 'bookmarks';
type FetchInteractionParams = { tweetID: TweetIDType, type: InteractionType, token: string, isInteracted: boolean };

async function postInteraction({ tweetID, type, token, isInteracted }: FetchInteractionParams) {
  if (!isInteracted) await api.post(`/${type}/${tweetID}`, undefined, { auth: token });
  else await api.delete(`/${type}/${tweetID}`, { auth: token });
}

export function useInteractionTweet(tweet: TweetType) {
  const { session } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { id: tweetID, user, userMeta } = tweet;
  const { retweetedByUser, likedByUser, bookmarkedByUser } = userMeta;
  const userID = user.id;

  const { mutate } = useMutation({
    mutationFn: postInteraction,
    onMutate: async ({ tweetID, type }) => {
      await queryClient.cancelQueries({
        predicate: ({ queryKey }) => queryKey[0] === 'tweets' || queryKey[0] === 'thread' || queryKey[0] === 'replies',
        type: 'active'
      });

      function updateReaction({ tweet, type }: { tweet: TweetType | StatusTweet, type: InteractionType, }) {
        if (type === 'retweets') {
          const counter = Number(tweet.retweets);
          return { ...tweet, userMeta: { ...userMeta, retweetedByUser: !retweetedByUser }, retweets: retweetedByUser ? counter - 1 : counter + 1 };
        }
        else if (type === 'likes') {
          const counter = Number(tweet.likes);
          return { ...tweet, userMeta: { ...userMeta, likedByUser: !likedByUser }, likes: likedByUser ? counter - 1 : counter + 1 };
        }
        else return { ...tweet, userMeta: { ...userMeta, bookmarkedByUser: !bookmarkedByUser } };
      }

      function mapReactionTweetArray({ tweets, tweetID, type }: { tweets: TweetType[] | StatusTweet[], tweetID: string, type: InteractionType }) {
        return tweets.map(tw => tw.id === tweetID ? updateReaction({ tweet: tw, type }) : tw);
      }

      // Optimistic update para los tweets
      const previousData = queryClient.getQueriesData<InfinityTweetsData>({ queryKey: ['tweets'] });

      queryClient.setQueriesData<InfinityTweetsData>({ queryKey: ['tweets'] },
        (oldData) => {
          if (oldData == undefined) return oldData;
          const { pageParams, pages } = oldData;

          return {
            pageParams,
            pages: pages.map(({ tweets, nextCursor }) => ({
              nextCursor,
              tweets: mapReactionTweetArray({ tweets, tweetID, type })
            }))
          };
        });

      // Optimistic update para los hilos
      const prevThreadData = queryClient.getQueriesData<ApiThreadResponse>({ queryKey: ['thread'], type: 'active' });

      queryClient.setQueriesData<ApiThreadResponse>({ queryKey: ['thread'], type: 'active' },
        (oldData) => {
          if (oldData == undefined) return oldData;

          const { status, thread } = oldData;
          if (status.id === tweetID) return { status: updateReaction({ tweet: status, type }) as StatusTweet, thread };
          return { status, thread: mapReactionTweetArray({ tweets: thread, tweetID, type }) as StatusTweet[] };
        }
      );

      // Optimistic update para las respuestas de un usuario, es un array de hilos
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
                if (tweetID === status.id) return { status: updateReaction({ tweet: status, type }), thread };
                return { status, thread: mapReactionTweetArray({ tweets: thread, tweetID, type }) };
              })
            }))
          };
        });

      const prevNotifications = queryClient.getQueryData<ApiNotificationType[]>(['notifications']);

      queryClient.setQueryData<ApiNotificationType[]>(['notifications'], (oldData) => {
        if (oldData == undefined) return oldData;

        oldData.forEach(notification => {
          const { type: notificationType, tweet } = notification;
          if (notificationType !== 'comment') return notification;

          return { ...notification, tweet: updateReaction({ tweet, type }) };
        });
      });

      return { previousData, prevThreadData, prevUserReplies, prevNotifications };
    },
    onError: (err, _, context) => {
      console.error(err);

      if (context == undefined) return;
      const { prevNotifications, ...otherContext } = context;

      const prevData = Object.values(otherContext);
      prevData.forEach(prev => {
        prev.forEach(query => {
          const [queryKey, oldData] = query;
          if (oldData) queryClient.setQueryData(queryKey, oldData);
        });
      });

      if (prevNotifications) queryClient.setQueryData(['notifications'], prevNotifications);
    }
  });

  function handleClick(e: React.MouseEvent<HTMLButtonElement>, interactionType: InteractionType) {
    e.stopPropagation();
    if (!session?.user) return navigate(paths.auth.login.getHref(window.location.pathname));

    const isInteracted = interactionType === 'likes' && likedByUser
      || interactionType === 'retweets' && retweetedByUser
      || interactionType === 'bookmarks' && bookmarkedByUser;

    mutate({ tweetID, type: interactionType, token: session.token, isInteracted }, {
      onSuccess: () => {
        console.log('Interaccion exitosa!');
        if (interactionType === 'bookmarks' || userID === session.user.id) return;
        if (interactionType === 'likes' && likedByUser) return;
        if (interactionType === 'retweets' && retweetedByUser) return;

        const notificationType = interactionType === 'likes' ? 'like' : 'retweet';
        api.post('/notifications', {
          type: notificationType,
          recipientID: userID,
          tweetID
        }, { auth: session.token })
          .then(() => console.log('Notificacion enviada!'))
          .catch(err => console.error(err));
      }
    });
  }

  function handleReplyBtn(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    if (!session?.user) return navigate(paths.auth.login.getHref(window.location.pathname), { state: { replying: true } });  // <- Modificar para que cargue el tweet que quiere responder o no xd

    navigate(paths.app.post.getHref(), {
      state: {
        backgroundLocation: location,
        tweet,
        replying: true
      }
    });
  }

  return {
    handleClick,
    handleReplyBtn
  };
}
