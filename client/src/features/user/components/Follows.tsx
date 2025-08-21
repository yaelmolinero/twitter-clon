import { useFollows } from '@/features/user/api/get-follows.ts';
import { paths } from '@/config/paths.ts';

import UserCard from '@/components/ui/UserCard.tsx';
import Navbar from '@/components/ui/Navbar.tsx';
import FilterNavbar from '@/components/ui/FilterNavbar.tsx';
import Divisor from '@/components/ui/Divisor.tsx';
import QueryFailed from '@/components/errors/QueryFailed.tsx';

import type { FilterNavbarLinks } from '@/types/types.d.ts';

interface Props {
  type: 'followers' | 'following';
}

function FollowsLayout({ type }: Props) {
  const { users, profile, isLoading, isError, isRefetching, refetch } = useFollows({ type });
  if (!users || !profile || isError) return <QueryFailed isRefetching={isLoading || isRefetching} retryFn={refetch} />;

  const { username, name } = profile;

  const navLinks: FilterNavbarLinks = [
    { label: 'Seguidores', href: paths.app.profile.followers.getHref(username) },
    { label: 'Siguiendo', href: paths.app.profile.following.getHref(username) }
  ];

  return (
    <div>
      <Navbar
        type='navigation'
        label={name}
        subLabel={`@${username}`}
      >
        <FilterNavbar filters={navLinks} />
        <Divisor />
      </Navbar>

      {users.map(user => <UserCard user={user} variant='detailed' key={user.id} />)}
    </div>
  );
}

export default FollowsLayout;
