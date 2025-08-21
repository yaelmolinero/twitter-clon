import { useInfinityTweets } from '@/features/tweets/hooks/useInfinityTweets.ts';

import Tweet from '@/features/tweets/components/Tweet.tsx';
import ImagesCollage from '@/features/tweets/components/ImagesCollage.tsx';
import QueryFailed from '@/components/errors/QueryFailed.tsx';
import InfinityScroll from '@/features/tweets/components/InfinityScroll.tsx';
import Spinner from '@/components/ui/Spinner.tsx';
import type { UseInfiniteTweetsProps } from '@/types/tweets.d.ts';

interface Props extends UseInfiniteTweetsProps {
  variant?: 'normal' | 'collage';
}

function TweetsContainer({ variant = 'normal', ...params }: Props) {
  const { tweets, isLoading, isError, isRefetching, hasNextPage, isFetchingNextPage, refetch, fetchNextPage } = useInfinityTweets(params);

  if (isError || !tweets) return <QueryFailed isRefetching={isRefetching} retryFn={refetch} />;
  if (isLoading && !isError) return <Spinner loadingContainer />;

  return (
    <div className='w-full pb-16'>
      {variant === 'normal'
        ? tweets.map((tweet) => <Tweet {...tweet} variant={'normal'} key={tweet.id} />)
        : <ImagesCollage tweets={tweets} />
      }

      <InfinityScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}

export default TweetsContainer;
