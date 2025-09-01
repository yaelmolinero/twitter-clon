import { useLocation } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { useWindowSize } from '@/contexts/windowSizeContext/useWindowSize.ts';
import { useState } from 'react';
import { paths } from '@/config/paths.ts';

import NavLinkItem, { type LinkProps } from '@/components/layouts/navigation/NavLinkItem.tsx';
import LogoutButton from '@/features/auth/components/LogoutButton.tsx';
import ComposeButton from '@/features/tweets/components/ComposeButton.tsx';
import ProfileImage from '@/components/ui/ProfileImage.tsx';
import {
  XIcon,
  HomeIcon,
  SearchIcon,
  NotificationIcon,
  BookmarkIcon,
  ProfileIcon
} from '@/assets/icons';

function Navigation() {
  const location = useLocation();
  const { session, isUserAuthenticated } = useUser();
  const { width: windowWidth } = useWindowSize();
  const [show, setShow] = useState(false);

  if (!session) return;
  const user = session.user ? session.user : { name: 'Guest', username: 'guest', avatar: null, id: '0', bio: null };
  const { name, username } = user;

  const isHomePage = location.pathname === '/home';
  const isMovil = windowWidth <= 600;
  const xlBreakpoint = 1280;

  const SIDEBAR_LINKS: LinkProps[] = [
    {
      to: paths.app.home.getHref(),
      icon: HomeIcon,
      label: 'Inicio'
    },
    {
      to: paths.app.explore.getHref(),
      icon: SearchIcon,
      label: 'Explorar'
    },
    {
      to: paths.app.notifications.getHref(),
      icon: NotificationIcon,
      label: 'Notificaciones'
    },
    {
      to: paths.app.bookmarks.getHref(),
      icon: BookmarkIcon,
      label: 'Guardados'
    },
    {
      to: paths.app.profile.getHref(username),
      icon: ProfileIcon,
      label: 'Perfil'
    }
  ];

  function handleShow(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (!isMovil) return;

    e.stopPropagation();
    setShow(!show);

    if (show) document.body.classList.remove('!overflow-y-hidden');
    else document.body.classList.add('!overflow-y-hidden');
  }

  return (
    <header className='sticky top-0 z-20 movile:z-0 h-fit'>
      {/* Solo se muestra este header en movil y en la home page */}
      {(isMovil && isHomePage) && (
        <div className='flex justify-between items-center px-4 py-3 bg-background'>
          <button onClick={handleShow}>
            <ProfileImage user={user} size='size-8' disabled disableUserPopup />
          </button>

          <div>
            <XIcon className='size-6 text-primary' />
          </div>

          <LogoutButton />
        </div>
      )}

      <div className={(isMovil && show) ? 'fixed inset-0 z-50 dark:scheme-dark bg-black/80' : ''} onClick={handleShow}>
        <div className={`h-dvh bg-background ${isMovil ? `fixed top-0 w-80 transition duration-200 ${show ? 'translate-x-0' : '-translate-x-full'}` : ''}`}>
          <div className='flex flex-col xl:w-69 h-full min-w-10 md:px-2'>
            <div className='flex-1 overflow-y-auto'>
              <h1 role='heading'>
                <NavLinkItem to={paths.app.home.getHref()} icon={XIcon} onlyIcon />
              </h1>
              <nav>
                {isUserAuthenticated && SIDEBAR_LINKS.map(
                  ({ to, icon, label }, index) => <NavLinkItem to={to} icon={icon} label={label} onlyIcon={windowWidth > 600 && windowWidth <= xlBreakpoint} key={index} />
                )}
              </nav>

              {(isUserAuthenticated && !isMovil) && <ComposeButton small={windowWidth <= xlBreakpoint} />}
            </div>

            {/* User profile */}
            {isUserAuthenticated && (
              // <div className='w-full flex items-center p-3 my-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200'>
              <div className='w-full flex items-center p-3 my-2 rounded-full'>
                <ProfileImage user={user} size='size-10' disabled disableUserPopup />
                {(isMovil || windowWidth > xlBreakpoint) && (
                  <div className='flex-1 px-3 *:block *:text-start *:leading-5'>
                    <span className='font-bold text-primary'>{name}</span>
                    <span className='text-secondary'>@{username}</span>
                  </div>
                )}
                {(isMovil || windowWidth > xlBreakpoint) && <LogoutButton />}
              </div>
            )}
          </div>
        </div>
      </div>

      {(isUserAuthenticated && isMovil) && <ComposeButton className='fixed right-5 bottom-0 z-0' small />}
    </header>
  );
}

export default Navigation;
