import { useCreateTweet } from '@/features/tweets/api/post-tweet.ts';
import TweetForm from '@/features/tweets/components/TweetForm.tsx';
import ErrorAlert from '@/components/errors/ErrorAlert.tsx';
import type { ParentTweetIDType, UserIDType } from '@/types/types.d.ts';

interface Props {
  type: 'create' | 'reply' | 'replyInModal';
  parentTweetID: ParentTweetIDType;
  isReplyingModal?: boolean;
  authorID?: UserIDType;
}

function CreateTweet({ type, parentTweetID, isReplyingModal = false, authorID }: Props) {
  const { newTweet, isPending, isError, handleChange, handleSubmit } = useCreateTweet({ parentTweetID, isReplyingModal, authorID });
  const { content, file, image } = newTweet;

  return (
    <form className={`flex-1 mt-1 relative ${isReplyingModal && 'flex flex-col-reverse'}`} onSubmit={handleSubmit}>
      {(isPending && !isReplyingModal) && <div className='loader absolute top-0 inset-x-0 -mt-1' />}
      {(isPending && isReplyingModal) && <div className='loader absolute bottom-0 inset-x-0' />}
      {isError && <ErrorAlert className={`${isReplyingModal ? 'relative bottom-2' : ''}`} />}

      <TweetForm
        type={type}
        content={content}
        file={file}
        image={image}
        handleChange={(params) => handleChange(params)}
      />
    </form>
  );
}

export default CreateTweet;
