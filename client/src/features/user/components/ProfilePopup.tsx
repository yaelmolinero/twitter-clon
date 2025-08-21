import { useProfile } from '@/features/user/api/get-profile.ts';

import ProfileImage from '@/components/ui/ProfileImage.tsx';
import FollowButton from '@/features/user/components/FollowButton.tsx';
import UserInfo from '@/components/ui/UserInfo.tsx';
import FormatTextContet from '@/components/ui/FormatTextContent.tsx';
import FollowsLink from '@/components/ui/FollowsLink.tsx';

function ProfilePopup({ username: usernameFromParams }: { username: string }) {
  const { data, isLoading, isError } = useProfile({ username: usernameFromParams });

  if (!data || isLoading || isError) return null;
  const { id: userID, username, bio, isSessionAcount, userMeta, followers, following } = data;

  return (
    <div className='w-[300px] p-4 rounded-2xl bg-background shadow-twitterShadow space-y-2' onClick={(e) => e.stopPropagation()}>
      <div className='flex items-start justify-between'>
        <ProfileImage user={data} size='size-16' disableUserPopup />
        {(!isSessionAcount && userMeta) && <FollowButton userID={userID} userMeta={userMeta} />}
      </div>

      <div>
        <UserInfo user={data} isFocused />
      </div>

      {bio && <FormatTextContet text={bio} preWrap />}

      <div className='mt-2 flex gap-1'>
        <FollowsLink
          type='following'
          username={username}
          value={following}
        />
        <FollowsLink
          type='followers'
          username={username}
          value={followers}
        />
      </div>
    </div>
  );
}

export default ProfilePopup;
