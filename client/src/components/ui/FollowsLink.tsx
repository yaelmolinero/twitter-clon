import { Link } from 'react-router';
import { paths } from '@/config/paths.ts';
import { formatNumber } from '@/utils/format.ts';

interface Props {
  type: 'followers' | 'following';
  username: string;
  value: number;
}

function FollowsLink({ type, username, value }: Props) {
  const redirectTo = type === 'followers'
    ? paths.app.profile.followers.getHref(username)
    : paths.app.profile.following.getHref(username);

  const label = type === 'followers' ? 'Seguidores' : 'Siguiendo';

  return (
    <Link
      to={redirectTo}
      className='text-primary hover:underline'
    >
      <span className='font-semibold'>{formatNumber(value)}</span>
      <span className='text-secondary'> {label}</span>
    </Link>
  );
}

export default FollowsLink;
