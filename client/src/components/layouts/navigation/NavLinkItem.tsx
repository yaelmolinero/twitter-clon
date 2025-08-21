import { NavLink } from 'react-router';
import { JSX } from 'react';

import type { SidebarIconProps } from '@/types/types.d.ts';

export interface LinkProps {
  to: string;
  icon: (input: SidebarIconProps) => JSX.Element;
  label?: string;
  onlyIcon?: boolean;
  small?: boolean;
}

function NavLinkItem({ to, icon: Icon, label, onlyIcon = false }: LinkProps) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      className='flex items-center group w-full py-1 [&.active]:font-semibold'
    >
      {({ isActive }) => (
        <div className='flex gap-4 items-center p-3 rounded-full group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-200'>
          <div>
            <Icon className='size-7 text-primary' isActive={isActive} />
          </div>
          {(label && !onlyIcon) && <div className='text-primary text-xl'>{label}</div>}
        </div>
      )}
    </NavLink>
  );
}

export default NavLinkItem;
