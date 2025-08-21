import { useNavigate } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { paths } from '@/config/paths.ts';

import FollowButton from '@/features/user/components/FollowButton.tsx';
import UserInfo from '@/components/ui/UserInfo.tsx';
import ProfileImage from '@/components/ui/ProfileImage.tsx';
import FormatTextContet from '@/components/ui/FormatTextContent.tsx';

import type { UserCard } from '@/types/users.d.ts';

interface Props {
  user: UserCard;
  variant: 'normal' | 'detailed';
}

function UserCard({ user, variant }: Props) {
  const navigate = useNavigate();
  const { session } = useUser();
  const { id: userID, username, bio } = user;
  const { userMeta, ...userBasic } = user;

  const showFollowButton = !(session?.user && session.user.id === userID);
  const userMetaFollow = userMeta ? userMeta : { isFollowing: false, isFollowedBy: false };

  function handleClick() {
    navigate(paths.app.profile.getHref(username), {
      state: { user: userBasic }
    });
  }

  return (
    <div
      onClick={handleClick}
      className='flex gap-2 px-4 py-3 cursor-pointer hover:bg-hoverColor'
    >
      <ProfileImage user={user} size='size-10' />

      <div className='flex-1 overflow-hidden'>
        <div className='flex items-center gap-2'>
          <UserInfo user={userBasic} isFocused />
          {showFollowButton && <FollowButton userID={userID} userMeta={userMetaFollow} />}
        </div>

        {(variant === 'detailed' && bio) && <FormatTextContet text={bio} />}
      </div>
    </div>
  );
}

export default UserCard;
