import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { paths } from '@/config/paths.ts';

import ProfilePopup from '@/features/user/components/ProfilePopup.tsx';
import DEFAULT_IMAGE from '@/assets/img/default_avatar.webp';
import type { UserBasic } from '@/types/users.d.ts';

interface Props {
  size: string;
  user: UserBasic;
  disabled?: boolean;
  disableUserPopup?: boolean;
}

function ProfileImage({ user, size, disabled = false, disableUserPopup = false }: Props) {
  const username = user?.username ?? 'guest';
  const src = user?.avatar ?? null;

  const [showPopup, setShowPopup] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const image = (
    <img
      src={src ?? DEFAULT_IMAGE}
      alt={`Foto de perfi de ${username}`}
      className={`${size} rounded-full aspect-square ${!disabled && 'cursor-pointer hover:opacity-90 transition-opacity duration-200'}`}
      loading='lazy'
    />
  );

  function handleMousePosition(type: 'enter' | 'leave') {
    if (disableUserPopup) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      setShowPopup(type === 'enter');
      timeoutRef.current = null;
    }, 500);
  }

  return (
    <div
      className='relative shrink-0 grow-0'
      onMouseEnter={() => handleMousePosition('enter')}
      onMouseLeave={() => handleMousePosition('leave')}
    >
      {!disabled ? (
        <Link
          to={paths.app.profile.getHref(username)}
          onClick={(e) => e.stopPropagation()}
          state={{ user }}
          children={image}
        />
      ) : (
        <div>{image}</div>
      )}

      {showPopup && (
        <div className='absolute z-10 mt-2 top-full left-0 md:left-1/2 md:-translate-x-1/2'>
          <ProfilePopup username={username} />
        </div>
      )}
    </div>
  );
}

export default ProfileImage;
