import { useState } from 'react';
import { useLocation, useParams, Navigate } from 'react-router';
import { useThread } from '@/features/tweets/api/get-thread.ts';
import { paths } from '@/config/paths.ts';
import { useWindowSize } from '@/contexts/windowSizeContext/useWindowSize.ts';

import ThreadContainer from '@/features/tweets/components/ThreadContainer.tsx';
import TweetsContainer from '@/features/tweets/components/TweetsContainer.tsx';
import TweetActions from '@/features/tweets/components/tweetParts/TweetActions.tsx';
import CreateTweet from '@/features/tweets/components/CreateTweet.tsx';

import Spinner from '@/components/ui/Spinner.tsx';
import Divisor from '@/components/ui/Divisor.tsx';
import { CloseIcon, ChevronIcon } from '@/assets/icons';

function getHideThreadStorage(): boolean {
  const storageValue = window.localStorage.getItem('hideThread');
  if (!storageValue) return false;

  return JSON.parse(storageValue);
}

function TweetImageModal() {
  const { status, thread, isLoading, isError, isUserAuthenticated } = useThread();

  const location = useLocation();
  const { username: usernameParam, tweetID } = useParams();
  const [hideThread, setHideThread] = useState(getHideThreadStorage());
  const { width } = useWindowSize();

  function handleHideTweets(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setHideThread(!hideThread);
    window.localStorage.setItem('hideThread', JSON.stringify(!hideThread));
  }

  if (!location.state || isError) return <Navigate to={paths.app.status.getHref(usernameParam as string, tweetID as string)} replace />;
  if (!status) return null;

  const { imageUrl } = status;

  return (
    <div className='flex w-full h-dvh'>
      <div className='flex-1 flex flex-col h-full relative'>
        <div className='flex-1 flex justify-center'>
          <img
            src={imageUrl as string}
            alt='Imágen del post'
            className='h-full w-auto object-contain aspect-video'
            onClick={(e) => e.stopPropagation()}
            loading='eager'
          />
        </div>

        <div className='w-full'>
          <div className='flex items-center px-2 mx-auto max-w-[600px] w-full h-12'>
            <div className='w-full'>
              <TweetActions
                tweet={status}
                primary
              />
            </div>
          </div>
        </div>

        <div className='absolute top-4 inset-x-4 flex justify-between'>
          <button
            aria-label='Cerrar la imagen'
            className='p-2 rounded-full text-white cursor-pointer bg-black/50 hover:bg-hoverColorSecondary transition-colors duration-200'
            children={<CloseIcon className='size-5' />}
          />
          <button
            aria-label='Ocultar hilo y comentarios'
            className='p-2 rounded-full text-white cursor-pointer hidden md:block bg-black/50 hover:bg-hoverColorSecondary transition-colors duration-200'
            onClick={handleHideTweets}
            children={<ChevronIcon className={`size-5 ${hideThread && 'rotate-180'}`} />}
          />
        </div>
      </div>

      {width > 768 && (
        <div className={`w-86 overflow-y-auto bg-background border-l border-borderColor ${hideThread ? 'hidden' : ''}`} onClick={(e) => e.stopPropagation()}>
          {isLoading && <Spinner loadingContainer />}
          <ThreadContainer tweetRoot={status} thread={thread} hideImage />

          {isUserAuthenticated && (<>
            <CreateTweet type='reply' parentTweetID={status.id} authorID={status.user.id} />
            <Divisor />
            <TweetsContainer type='comments' tweetID={tweetID} />
          </>)}
        </div>
      )}
    </div>
  );
}

export default TweetImageModal;
