import { useDelete } from '@/features/tweets/api/delete-tweet.ts';
import { formatDate } from '@/utils/format.ts';

import ProfileImage from '@/components/ui/ProfileImage.tsx';
import UserInfo from '@/components/ui/UserInfo.tsx';
import { ThreeDotsIcon, TrashIcon } from '@/assets/icons';

import type { TweetIDType, CreatedAtType } from '@/types/types.d.ts';
import type { UserBasic } from '@/types/users.d.ts';

interface Props {
  tweetID: TweetIDType;
  user: UserBasic;
  createdAt: CreatedAtType;
  isFocused: boolean;
  hideOptions?: boolean;
}

function TweetHeader({ tweetID, user, createdAt, isFocused, hideOptions = false }: Props) {
  const { id: userID } = user;
  const { showOptions, handleShowOptions, handleDelete } = useDelete({ tweetID, userID });

  return (
    <div className='flex items-start justify-between gap-2'>
      {isFocused ? (
        <div className='flex gap-2 mb-4'>
          <ProfileImage user={user} size='size-10' />
          <UserInfo user={user} isFocused />
        </div>
      ) : (
        <UserInfo user={user}>
          <span className='text-secondary whitespace-nowrap shrink-0'>· {formatDate(createdAt)}</span>
        </UserInfo>
      )}

      {/* Opciones del tweet */}
      {!hideOptions && (
        <div className='relative group text-secondary hover:text-twitterBlue transition-colors duration-200'>
          <button
            className='inline-flex relative'
            onClick={handleShowOptions}
          >
            <div className='absolute inset-0.5 -m-[50%] -z-10 rounded-full group-hover:bg-twitterBlue/10 transition-colors duration-200'></div>
            <ThreeDotsIcon className='size-5 fill-inherit' />
          </button>

          {showOptions && (
            <div className='absolute top-0 right-0 w-60 py-1 bg-background rounded-lg outline outline-borderColor shadow-twitterShadow z-10 pointer-events-auto'>
              <button onClick={handleDelete} className='flex gap-2 items-center w-full py-2 px-4 text-red-600 cursor-pointer hover:bg-hoverColor'>
                <div children={<TrashIcon className='size-5' />} />
                <span className='block flex-1 font-bold text-start'>Eliminar</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TweetHeader;
