import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useModalClose } from '@/contexts/modalCloseContext/useModalClose.ts';
import { paths } from '@/config/paths.ts';

function ModalLayout() {
  const { handleCloseClick } = useModalClose();

  const pathname = window.location.pathname;
  const backgroundColor = (pathname === paths.app.post.getHref() || pathname === paths.app.settings.profile.getHref())
    ? 'bg-modalBackground'
    : 'bg-black/80';

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      handleCloseClick();
    }
    const isMovil = window.innerWidth <= 600;

    window.addEventListener('keydown', handleEsc);
    document.body.classList.add('!overflow-y-hidden');
    if (!isMovil) document.body.classList.add('pr-4');

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.classList.remove('!overflow-y-hidden');
      if (!isMovil) document.body.classList.remove('pr-4');
    };
  }, [handleCloseClick]);

  return (
    <div
      className={`fixed inset-0 z-50 dark:scheme-dark ${backgroundColor}`}
      onClick={handleCloseClick}
    >
      <Outlet />
    </div>
  );
}

export default ModalLayout;
