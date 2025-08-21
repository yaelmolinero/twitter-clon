import Divisor from '@/components/ui/Divisor.tsx';

interface Props {
  isStatus: boolean;
}

function DeletedTweet({ isStatus }: Props) {
  return (
    <div className={`relative px-4 ${isStatus ? 'pt-2 pb-4' : 'py-2'}`}>
      <p className='px-4 py-3 rounded-twitterRounded text-secondary bg-hoverColor dark:bg-[#16181C] outline-1 outline-borderColor'>
        El autor de este post lo eliminó.
      </p>
      {!isStatus
        ? <div className='absolute left-[35px] w-0.5 bg-borderColor h-5'></div>
        : <Divisor className='absolute bottom-0 inset-x-0' />
      }
    </div>
  );
}

export default DeletedTweet;
