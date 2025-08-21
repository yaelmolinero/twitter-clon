import { useCreateThread } from '@/features/tweets/api/post-thread.ts';
import { useModalClose } from '@/contexts/modalCloseContext/useModalClose.ts';

import TweetForm from '@/features/tweets/components/TweetForm.tsx';
import ModalHeader from '@/components/ui/ModalHeader.tsx';
import UnsavedChangesModal from '@/components/ui/UnsavedChangesModal.tsx';
import ErrorAlert from '@/components/errors/ErrorAlert.tsx';

function ComposeTweet() {
  const {
    thread,
    disableForm,
    isPending,
    isError,
    addTweet,
    removeTweet,
    handleChange,
    handleFocus,
    handleSubmit,
  } = useCreateThread();

  const { handleCloseClick } = useModalClose();

  return (
    <>
      <div className='w-full h-dvh flex justify-center items-start py-16'>
        <div className='max-w-[600px] w-full max-h-full bg-background rounded-2xl overflow-y-auto' onClick={(e) => e.stopPropagation()}>
          {isPending && <div className='loader z-20 sticky top-0' />}
          <ModalHeader handleClose={handleCloseClick} />

          <form onSubmit={handleSubmit}>
            {isError && <ErrorAlert />}

            {thread.map(({ id, content, image, file, isFocused }, index) => (
              <TweetForm
                key={id}
                type='thread'
                content={content}
                file={file}
                image={image}
                handleChange={(newValue) => handleChange({ ...newValue, id })}
                addTweetOnThread={() => addTweet(index)}
                removeTweetOnThread={() => removeTweet(id, index)}
                focusOnThread={() => handleFocus(id)}
                isFocused={isFocused}
                isDisabled={disableForm}
                isMoreThanOne={thread.length > 1}
              />
            ))}
          </form>
        </div>
      </div>

      <UnsavedChangesModal variant='thread' />
    </>
  );
}

export default ComposeTweet;
