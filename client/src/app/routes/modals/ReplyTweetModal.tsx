import { useLocation } from 'react-router';
import { useModalClose } from '@/contexts/modalCloseContext/useModalClose.ts';

import CreateTweet from '@/features/tweets/components/CreateTweet.tsx';
import Tweet from '@/features/tweets/components/Tweet.tsx';
import ModalHeader from '@/components/ui/ModalHeader.tsx';
import UnsavedChangesModal from '@/components/ui/UnsavedChangesModal.tsx';

import type { TweetType } from '@/types/tweets.d.ts';

function ReplyTweetModal() {
  const location = useLocation();
  const { tweet } = location.state as { tweet?: TweetType };
  const { handleCloseClick } = useModalClose();

  if (!tweet) return null;

  return (
    <>
      <div className='w-full h-dvh flex justify-center items-start py-16'>
        <div className='max-w-[600px] w-full max-h-full bg-background rounded-2xl overflow-y-auto' onClick={(e) => e.stopPropagation()}>
          <ModalHeader handleClose={handleCloseClick} />

          <Tweet
            variant='replying'
            {...tweet}
          />

          <CreateTweet
            type='replyInModal'
            parentTweetID={tweet.id}
            isReplyingModal
            authorID={tweet.user.id}
          />
        </div>
      </div>

      <UnsavedChangesModal variant='thread' />
    </>
  );
}

export default ReplyTweetModal;
