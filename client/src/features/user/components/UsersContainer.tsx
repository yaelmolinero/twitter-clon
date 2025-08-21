import { useSuggestions } from '@/features/user/api/get-users';
import { Link } from 'react-router';
import { paths } from '@/config/paths.ts';

import UserCard from '@/components/ui/UserCard.tsx';
import InfinityScroll from '@/features/tweets/components/InfinityScroll.tsx';
import Spinner from '@/components/ui/Spinner.tsx';
import QueryFailed from '@/components/errors/QueryFailed.tsx';

import type { UserCard as UserCardType } from '@/types/users.d.ts';

interface Props {
  variant: 'normal' | 'detailed';
  type: 'suggestions' | 'query';
  users?: UserCardType[];
  query?: string;
  withoutBorder?: boolean;
  hideHeader?: boolean;
  limitResult?: boolean;
}

function UsersContainer({ variant, type, users: relevantUsers, query, withoutBorder = false, hideHeader = false, limitResult = false }: Props) {
  const {
    users,
    isLoading,
    isError,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage
  } = useSuggestions({ type, query });

  const isNormal = variant === 'normal';
  const usersToShow = relevantUsers
    ? relevantUsers
    : limitResult ? users.slice(0, 3) : users;

  if (!usersToShow) return (
    <div className={`${!withoutBorder && 'border-1 border-borderColor rounded-2xl'}`}>
      {(isLoading && !isError) && <Spinner loadingContainer />}
      {isError && <QueryFailed isRefetching={isRefetching} retryFn={refetch} />}
    </div>
  );

  if (type === 'query' && usersToShow.length === 0) return null;

  return (
    <div className={`${!withoutBorder && 'border-1 border-borderColor rounded-2xl'}`}>
      {!hideHeader && (
        <div className="px-4 py-3">
          <h2 className="text-primary text-xl font-bold">
            {isNormal ? 'A quién seguir' : 'Personas relevantes'}
          </h2>
        </div>
      )}

      {usersToShow.map(user => <UserCard user={user} variant={variant} key={user.id} />)}

      {(isNormal && usersToShow.length === 0) && <p className='text-secondary px-4 py-6'>Parece que no hay usuarios que seguir...</p>}
      {(limitResult && usersToShow.length > 3) && (
        <Link
          to={query ? paths.app.search.getHref({ q: query, tab: 'user' }) : paths.app.connectPeople.getHref()}
          className='block p-4 text-twitterBlue hover:bg-hoverColor transition-colors duration-200'>
          Ver todo
        </Link>
      )}

      {!limitResult && (
        <InfinityScroll
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </div>
  );
}

export default UsersContainer;
