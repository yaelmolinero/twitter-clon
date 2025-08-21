import { useState } from 'react';
import { useUser } from '@/hooks/useAuth.ts';
import { useInfinityTweets } from '@/features/tweets/hooks/useInfinityTweets.ts';
import { usePageTitle } from '@/hooks/usePageTitle.ts';

import TweetsFeed from '@/features/tweets/components/TweetsContainer.tsx';
import CreateTweet from '@/features/tweets/components/CreateTweet.tsx';
import HomeNavLink from '@/components/ui/HomeTabs.tsx';
import Divisor from '@/components/ui/Divisor.tsx';

type FeedType = 'foryou' | 'following';
const FEED_STORAGE_NAME = 'feedType';

function getFeedFromLocalStorage(): FeedType {
  return window.localStorage.getItem(FEED_STORAGE_NAME) as FeedType ?? 'foryou';
}

function Home() {
  const { isUserAuthenticated } = useUser();
  const [feedType, setFeedType] = useState(getFeedFromLocalStorage());
  const { refetch } = useInfinityTweets({ type: feedType });
  usePageTitle('Inicio');

  function refetchFeed(value: FeedType) {
    if (feedType === value) return refetch();

    setFeedType(value);
    window.localStorage.setItem(FEED_STORAGE_NAME, value);
  }

  return (
    <div>
      <nav className='w-full flex sticky top-14 movile:top-0 z-10 border-b-1 border-borderColor bg-white/85 dark:bg-black/65 backdrop-blur-md'>
        <HomeNavLink
          label='Para ti'
          isActive={feedType === 'foryou'}
          handleClick={() => refetchFeed('foryou')}
        />
        {isUserAuthenticated && (
          <HomeNavLink
            label='Siguiendo'
            isActive={feedType === 'following'}
            handleClick={() => refetchFeed('following')}
          />
        )}
      </nav>

      {isUserAuthenticated && (<>
        <CreateTweet type='create' parentTweetID={null} />
        <Divisor />
      </>)}

      <TweetsFeed type={feedType} />
    </div>
  );
}

export default Home;
