import { useState, useEffect, } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { useModalClose } from '@/contexts/modalCloseContext/useModalClose.ts';
import { api } from '@/lib/api-client.ts';

import type { ApiTweetCreatedResponse } from '@/types/api.d.ts';
import type { NewPostState, TweetType, InfinityTweetsData } from '@/types/tweets.d.ts';
import type { ParentTweetIDType, UserIDType } from '@/types/types.ts';

type FetchParams = { token: string; newTweet: NewPostState & { parentTweetID: ParentTweetIDType } };
async function createTweet({ token, newTweet }: FetchParams) {
  const { parentTweetID, content, file } = newTweet;
  const formData = new FormData();
  formData.append('parentTweetID', parentTweetID?.toString() ?? 'null');
  formData.append('content', content);
  if (file) formData.append('image', file);

  return await api.post<ApiTweetCreatedResponse>('/tweets', formData, { auth: token });
}

type CreateTweetParams = { parentTweetID: ParentTweetIDType, isReplyingModal?: boolean, authorID?: UserIDType };
export function useCreateTweet({ parentTweetID, isReplyingModal = false, authorID }: CreateTweetParams) {
  const { session } = useUser();
  const queryClient = useQueryClient();
  const { setConfirmClose } = useModalClose();
  const navigate = useNavigate();

  const [newTweet, setNewTweet] = useState<NewPostState>({ content: '', file: undefined, image: null });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createTweet,
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (val) => val.queryKey[0] === 'tweets',
        type: 'active'
      });
    },
    onSuccess: (data) => {
      function addNewTweet(oldPagesArray?: InfinityTweetsData): InfinityTweetsData {
        const newTweet: TweetType = {
          ...data,
          deleted: false,
          likes: 0,
          comments: 0,
          retweets: 0,
          userMeta: { retweetedByUser: false, bookmarkedByUser: false, likedByUser: false }
        };
        console.log(oldPagesArray);

        if (!oldPagesArray) return {
          pageParams: [1],
          pages: [{ tweets: [newTweet] }],
        };

        const prevData = structuredClone(oldPagesArray);
        prevData.pages[0].tweets = [newTweet, ...prevData.pages[0].tweets];

        return {
          pageParams: oldPagesArray.pageParams,
          pages: prevData.pages,
        };
      }

      if (!parentTweetID) {
        queryClient.setQueriesData({
          predicate: (val) => val.queryKey[0] === 'tweets' && (val.queryKey[1] === 'foryou' || val.queryKey[1] === 'following'),
          type: 'all'
        }, addNewTweet);
      } else if (parentTweetID && !isReplyingModal) {
        queryClient.setQueriesData({
          predicate: (val) => val.queryKey[0] === 'tweets' && val.queryKey[1] === 'comments',
          type: 'active'
        }, addNewTweet);

      }

      // Manda una notifiacion al autor del tweet de que el usuario de la sesion comento
      if (session && parentTweetID && authorID) {
        api.post('/notifications', {
          type: 'comment',
          recipientID: authorID,
          tweetID: data.id
        }, { auth: session.token })
          .then(() => console.log('Notificacion enviada!'))
          .catch(err => console.error(err));;
      }

      if (isReplyingModal) return navigate(-1);
      resetForm();
    },
    onError: (error) => console.error(error),
    retry: false
  });

  function handleChange(params: NewPostState) {
    setNewTweet(params);
  }

  function resetForm() {
    setNewTweet({ content: '', file: undefined, image: null });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.token) return;

    mutate({ newTweet: { ...newTweet, parentTweetID }, token: session.token });
  }

  useEffect(() => {
    if (!isReplyingModal) return;

    setConfirmClose(() => {
      const { content, image, file } = newTweet;
      const hasChanges = content !== '' || image != null || file != undefined;

      return hasChanges;
    });

    return () => setConfirmClose(null);

  }, [newTweet, isReplyingModal, setConfirmClose]);

  return {
    newTweet,
    isPending,
    isError,
    handleChange,
    handleSubmit
  };
}
