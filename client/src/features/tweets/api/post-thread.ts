import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { useModalClose } from '@/contexts/modalCloseContext/useModalClose.ts';
import { useUser } from '@/hooks/useAuth.ts';
import { api } from '@/lib/api-client.ts';

import type { ApiTweetCreatedResponse } from '@/types/api.d.ts';
import type { NewPostState, NewTweetInThread, TweetType, InfinityTweetsData } from '@/types/tweets.d.ts';

type FetchParams = { token: string; newThread: NewPostState[] };

async function postThread({ token, newThread }: FetchParams) {
  let parentTweetID = null;
  let tweetRoot;

  for (const tw of newThread) {
    const formData = new FormData();
    formData.append('parentTweetID', parentTweetID?.toString() ?? 'null');
    formData.append('content', tw.content);
    if (tw.file != undefined) formData.append('image', tw.file);

    const response = await api.post<ApiTweetCreatedResponse>('/tweets', formData, { auth: token });
    if (!parentTweetID) tweetRoot = response;
    parentTweetID = response.id;
  }
  return tweetRoot as ApiTweetCreatedResponse;
}

interface ThreadParams extends NewTweetInThread {
  id: number;
}

let localCount = 1;
function getNextID() {
  return Date.now() + localCount++;
}

export function useCreateThread() {
  const { session } = useUser();
  const queryClient = useQueryClient();

  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state as { post: NewPostState | null };

  const initialThread: ThreadParams[] = [{
    id: getNextID(),
    content: post?.content ?? '',
    image: post?.image ?? null,
    file: post?.file ?? undefined,
    isFocused: post == null
  }];
  if (post) initialThread.push({ id: getNextID(), content: '', image: null, file: undefined, isFocused: true });

  const [thread, setThread] = useState<ThreadParams[]>(initialThread);
  const [disableForm, setDisableForm] = useState(post == null);
  const { setConfirmClose } = useModalClose();

  useEffect(() => {
    setConfirmClose(() => {
      const hasChanges = thread.some(({ content, image, file }) => content !== '' || image != null || file != undefined);
      return hasChanges;
    });

    return () => setConfirmClose(null);

  }, [thread, setConfirmClose]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: postThread,
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (val) => val.queryKey[0] === 'tweets',
        type: 'active'
      });
    },
    onSuccess: (data) => {
      function addNewTweet(oldPagesArray: InfinityTweetsData): InfinityTweetsData {
        const newTweet: TweetType = {
          ...data,
          deleted: false,
          likes: 0,
          comments: thread.length - 1,
          retweets: 0,
          userMeta: { retweetedByUser: false, bookmarkedByUser: false, likedByUser: false }
        };

        const prevData = structuredClone(oldPagesArray);
        prevData.pages[0].tweets = [newTweet, ...prevData.pages[0].tweets];
        return {
          pageParams: oldPagesArray.pageParams,
          pages: prevData.pages,
        };
      }

      queryClient.setQueriesData({
        predicate: (val) => val.queryKey[0] === 'tweets' && (val.queryKey[1] === 'foryou' || val.queryKey[1] === 'following'),
        type: 'all'
      }, addNewTweet);

      navigate(-1);
    }
  });

  function handleFocus(id: number) {
    setThread(thread.map(tw => ({ ...tw, isFocused: tw.id === id })));
  }

  function handleChange({ id, content, image, file }: Omit<ThreadParams, 'isFocused'>) {
    setThread(prevThread => {
      const updatedThread = prevThread.map(tw => {
        if (tw.id !== id) return tw;
        return { ...tw, content, image, file };
      });

      const disableForm = updatedThread.some(({ content, image, file }) => content === '' && image == null && file == undefined);
      setDisableForm(disableForm);

      return updatedThread;
    });
  }

  function addTweet(indexInThread: number) {
    const newPost: ThreadParams = { id: getNextID(), content: '', image: null, file: undefined, isFocused: true };
    const unfocusThread = thread.map(tw => ({ ...tw, isFocused: false }));
    setDisableForm(true);

    // Se agrega al final del hilo
    if (indexInThread === thread.length - 1) return setThread([...unfocusThread, newPost]);
    setThread([
      ...thread.slice(0, indexInThread + 1),
      newPost,
      ...thread.slice(indexInThread + 1)
    ]);
  }

  function removeTweet(id: number, indexInThread: number) {
    const threadFiltered = thread.filter(tw => tw.id !== id);
    if (indexInThread === 0) threadFiltered[0].isFocused = true;
    else threadFiltered[indexInThread - 1].isFocused = true;

    setThread(threadFiltered);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.token) return;

    mutate({ newThread: thread, token: session.token });
  }

  return {
    thread,
    disableForm,
    isPending,
    isError,
    handleChange,
    addTweet,
    removeTweet,
    handleSubmit,
    handleFocus,
  };
}
