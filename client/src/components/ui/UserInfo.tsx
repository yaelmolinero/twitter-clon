import { Link } from 'react-router';
import { paths } from '@/config/paths.ts';
import type { UserBasic } from '@/types/users.d.ts';

interface Props {
  user: UserBasic
  isFocused?: boolean;
  children?: React.ReactNode;
}

function UserInfo({ user, isFocused = false, children }: Props) {
  const { name, username } = user;

  return (
    <div className={`flex flex-1 min-w-0 gap-1.5 ${isFocused && 'leading-5'}`}>
      <Link
        to={paths.app.profile.getHref(username)}
        onClick={(e) => e.stopPropagation()}
        className={`flex min-w-0 overflow-hidden gap-x-1 ${isFocused && 'flex-col'}`}
        state={{ user }}
      >
        <span className='truncate text-primary font-bold hover:underline'>{name}</span>
        <span className='truncate text-secondary'>@{username}</span>
      </Link>
      {!isFocused && children}
    </div>
  );
}

export default UserInfo;
