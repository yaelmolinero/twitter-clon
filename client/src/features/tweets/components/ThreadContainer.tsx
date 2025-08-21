import Tweet from '@/features/tweets/components/Tweet.tsx';
import type { TweetType } from '@/types/tweets.d.ts';

interface Props {
  tweetRoot: TweetType;
  thread: TweetType[];
  hideImage?: boolean;
  isUserReplies?: boolean;
};

function ThreadContainer({ tweetRoot, thread, hideImage = false, isUserReplies = false }: Props) {
  return (
    <div className='w-full'>
      {thread.length > 0 && thread.map(tw => <Tweet {...tw} variant='thread' key={tw.id} />)}

      <Tweet {...tweetRoot} variant={isUserReplies ? 'normal' : 'focused'} imageUrl={!hideImage ? tweetRoot.imageUrl : null} isStatus />
    </div>
  );
}

export default ThreadContainer;
