import { useThread } from '@/features/tweets/api/get-thread.ts';

import ThreadContainer from '@/features/tweets/components/ThreadContainer.tsx';
import TweetsContainer from '@/features/tweets/components/TweetsContainer.tsx';
import CreateTweet from '@/features/tweets/components/CreateTweet.tsx';
import Divisor from '@/components/ui/Divisor.tsx';
import Spinner from '@/components/ui/Spinner.tsx';
import NotFound from '@/components/errors/NotFound.tsx';

import MainLayout from '@/components/layouts/MainLayout.tsx';
import Navbar from '@/components/ui/Navbar.tsx';
import UsersContainer from '@/features/user/components/UsersContainer.tsx';

function Status() {
  const { status, thread, relevantUsers, isUserAuthenticated, isLoading, isError } = useThread();

  return (
    <MainLayout isStatus isError={isError} relevantUsers={<UsersContainer variant='detailed' type='suggestions' users={relevantUsers} />} >
      <Navbar type='navigation' label='Post' />
      {isError && <NotFound />}
      {isLoading && <Spinner loadingContainer />}

      {(status && !isError) && (<>
        <ThreadContainer tweetRoot={status} thread={thread} />

        {(isUserAuthenticated && !isError) && (<>
          <CreateTweet type='reply' parentTweetID={status.id} authorID={status.user.id} />
          <Divisor />

          <TweetsContainer type='comments' tweetID={status.id} />
        </>)}
      </>)}
    </MainLayout>
  );
}

export default Status;
