import { NavLink, useSearchParams } from 'react-router';

import type { FilterNavbarLinks } from '@/types/types.d.ts';

interface Props {
  filters: FilterNavbarLinks;
}

function FilterNavbar({ filters }: Props) {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') ?? '';

  return (
    <div className='flex text-nowrap overflow-x-auto'>
      {filters.map(({ label, href, tab = '' }) => (
        <div key={label} className='flex-1 hover:bg-hoverColorSecondary transition-colors duration-200'>
          <NavLink
            to={href}
            end
            className='flex justify-center w-full px-2'
          >
            {({ isActive }) => (
              <div className='relative py-3'>
                <span className={isActive && currentTab === tab ? 'text-primary font-bold' : 'text-secondary'}>
                  {label}
                </span>
                {(isActive && currentTab === tab) && <div className='absolute bottom-0 w-full h-1 rounded-full bg-twitterBlue'></div>}
              </div>
            )}
          </NavLink>
        </div>
      ))}
    </div>
  );
}

export default FilterNavbar;
