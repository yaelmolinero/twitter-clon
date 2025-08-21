import { useLogout } from '@/hooks/useAuth.ts';
import { useNavigate } from 'react-router';
import { paths } from '@/config/paths.ts';

import { LogoutIcon } from '@/assets/icons';

function LogoutButton() {
  const { logout } = useLogout();
  const navigate = useNavigate();

  function handleLogout() {
    logout().then(() => navigate(paths.auth.login.getHref(), { replace: true }));
  }

  return (
    <button
      type='button'
      onClick={handleLogout}
      className='cursor-pointer group **:transition-colors **:duration-200'
    >
      <div className='inline-flex relative'>
        <LogoutIcon className='size-5 text-primary group-hover:text-red-500' />
        <div className='absolute inset-0.5 -m-[50%] -z-10 rounded-full group-hover:bg-red-500/10'></div>
      </div>
    </button>
  );
}

export default LogoutButton;
