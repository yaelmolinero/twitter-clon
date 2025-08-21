import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { paths } from '@/config/paths.ts';

import { SearchIcon, CloseIcon } from '@/assets/icons';
import type { QueryParams } from '@/types/types.d.ts';

interface Props {
  value?: string;
}
type TabsType = QueryParams['tab'];

function SearchBar({ value }: Props) {
  const [query, setQuery] = useState(value ?? '');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const allowedTabs: TabsType[] = ['post', 'user', 'media'];
  const tab = allowedTabs.includes(tabParam as TabsType) ? (tabParam as TabsType) : undefined;

  function handleClearSearch() {
    setQuery('');
    document.getElementById('search-input')?.focus();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (cleanQuery === '') return;

    navigate(paths.app.search.getHref({ q: cleanQuery, tab }));
  }

  return (
    <div className='w-full px-3 py-2 bg-background outline-1 outline-borderColor rounded-full focus-within:outline-2 focus-within:outline-twitterBlue'>
      <form id='search' className='flex gap-4 items-center' onSubmit={handleSubmit}>
        <div className='flex gap-2 items-center flex-1'>
          <div>
            <SearchIcon className='size-4 text-secondary' />
          </div>

          <input
            type='text'
            name='search-input'
            id='search-input'
            autoComplete='off'
            placeholder='Buscar'
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            className='w-full text-primary placeholder:text-secondary border-none outline-none'
            required
          />
        </div>
        {query.length > 0 && (
          <div>
            <button
              type='button'
              onClick={handleClearSearch}
              aria-label='Limpiar busqueda'
              className='p-1 rounded-full bg-primary cursor-pointer'
              children={<CloseIcon className='size-3 text-buttonText' />}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default SearchBar;
