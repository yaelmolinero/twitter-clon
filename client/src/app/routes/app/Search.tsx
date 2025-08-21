import { useSearchParams, useNavigate, Navigate } from 'react-router';
import { useWindowSize } from '@/contexts/windowSizeContext/useWindowSize.ts';
import { paths } from '@/config/paths.ts';

import TweetsContainer from '@/features/tweets/components/TweetsContainer.tsx';
import UsersContainer from '@/features/user/components/UsersContainer.tsx';
import SearchBar from '@/components/layouts/discovery/SearchBar.tsx';
import FilterNavbar from '@/components/ui/FilterNavbar.tsx';
import Divisor from '@/components/ui/Divisor.tsx';
import { LeftRowIcon } from '@/assets/icons';

import type { FilterNavbarLinks, QueryTabs } from '@/types/types.d.ts';

function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { width } = useWindowSize();

  const query = searchParams.get('q') ?? '';
  const tab = (searchParams.get('tab') ?? undefined) as QueryTabs;
  const isGeneralSearch = tab == undefined;
  const isMovil = width <= 600;

  if (query === '') return <Navigate to={paths.app.explore.getHref()} replace />;
  const queryFilters: FilterNavbarLinks = [
    { label: 'Destacado', href: paths.app.search.getHref({ q: query }) },
    { label: 'Más reciente', href: paths.app.search.getHref({ q: query, tab: 'post' }), tab: 'post' },
    { label: 'Personas', href: paths.app.search.getHref({ q: query, tab: 'user' }), tab: 'user' },
    { label: 'Multimedia', href: paths.app.search.getHref({ q: query, tab: 'media' }), tab: 'media' },
  ];

  return (
    <div>
      <div className='bg-blur border-b border-borderColor sticky top-0 z-10'>
        <div className='flex items-center gap-6 pl-2 pr-4 py-2'>
          <button
            type='button'
            aria-labelledby='Retroceder'
            onClick={() => navigate(-1)}
            className='p-2 rounded-full cursor-pointer hover:bg-hoverColorSecondary transition-colors duration-200'
            children={<LeftRowIcon className='text-primary size-5' />}
          />
          <SearchBar value={query} />
        </div>

        <FilterNavbar filters={queryFilters} />
      </div>

      {(isGeneralSearch || tab === 'user') && (
        <UsersContainer
          type='query'
          variant='detailed'
          query={query}
          withoutBorder
          hideHeader={!isGeneralSearch}
          limitResult={isGeneralSearch}
        />
      )}

      {isGeneralSearch && <Divisor />}

      {(isGeneralSearch || tab !== 'user') && (
        <TweetsContainer
          type='query'
          query={query}
          onlyImages={tab === 'media'}
          variant={(!isGeneralSearch && tab === 'media' && !isMovil) ? 'collage' : 'normal'}
        />
      )}
    </div>
  );
}

export default Search;
