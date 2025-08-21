import { useUserReplies } from '@/features/tweets/api/get-replies.ts';

import ThreadContainer from '@/features/tweets/components/ThreadContainer.tsx';
import Spinner from '@/components/ui/Spinner.tsx';
import QueryFailed from '@/components/errors/QueryFailed.tsx';
import InfinityScroll from '@/features/tweets/components/InfinityScroll.tsx';

function ProfileReplies() {
  const { replies, isLoading, isError, isRefetching, hasNextPage, isFetchingNextPage, refetch, fetchNextPage } = useUserReplies();

  if (isLoading || !replies) return <Spinner loadingContainer />;
  if (isError) return <QueryFailed isRefetching={isRefetching} retryFn={refetch} />;

  return (
    <div>
      {replies.map(({ status, thread }) => <ThreadContainer tweetRoot={status} thread={thread} isUserReplies key={status.id} />)}

      <InfinityScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}

export default ProfileReplies;
