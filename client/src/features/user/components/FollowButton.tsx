import { useNavigate } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { useFollow } from '@/features/user/api/post-follows.ts';

import type { UserIDType } from '@/types/types.d.ts';
import type { UserMetaFollow } from '@/types/api.d.ts';

interface Props {
  userID: UserIDType;
  userMeta: UserMetaFollow;
}

function getButtonLabel({ isFollowing, isFollowedBy }: UserMetaFollow) {
  if (isFollowing) return 'Siguiendo';
  else if (isFollowedBy) return 'Seguir tú también';
  else return 'Seguir';
}

function FollowButton({ userID, userMeta }: Props) {
  const navigate = useNavigate();
  const { session } = useUser();
  const { mutate, isPending } = useFollow();

  const { isFollowing } = userMeta;
  const buttonLabel = getButtonLabel(userMeta);
  const buttonStyle = isFollowing
    ? 'w-40 border-borderColor text-primary hover:text-red-600 hover:border-red-700 hover:bg-red-700/10'
    : 'bg-primary text-buttonText hover:opacity-90 transition-opacity duration-200';

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!session?.token) return navigate('/login');
    mutate({ userID, isFollowing, token: session.token });
  }

  return (
    <div className='shrink-0 grow-0'>
      <button
        type='button'
        onClick={handleClick}
        disabled={isPending}
        className={`py-1 px-4 border rounded-full cursor-pointer font-semibold group ${buttonStyle}`}
      >
        <span className={isFollowing ? 'group-hover:hidden' : ''}>{buttonLabel}</span>
        {isFollowing && <span className='hidden group-hover:inline'>Dejar de seguir</span>}
      </button>
    </div>
  );
}

export default FollowButton;
