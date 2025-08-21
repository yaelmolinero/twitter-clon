import { useSearchParams, Navigate, Link } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { paths } from '@/config/paths.ts';

import { XIcon } from '@/assets/icons';
import { ROLES } from '@/types/users.d';

interface Props {
  variant: 'login' | 'signup';
  errorMsg: string;
  children: React.JSX.Element;
}

function AuthLayout({ variant, errorMsg, children }: Props) {
  const { session } = useUser();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? paths.app.home.getHref();

  if (session && session.role === ROLES.USER) return <Navigate to={redirectTo} replace />;

  return (
    <div className='flex w-full h-dvh justify-center items-center'>
      <div className='max-w-[600px] w-full py-2 px-4 md:px-16 space-y-6'>
        <XIcon className='text-primary size-8 mx-auto' />
        <h1 className='text-primary font-bold text-3xl text-center'>
          {variant === 'login' ? 'Inicia sesión en X (clon)' : 'Crea tu cuenta'}
        </h1>

        {children}

        {
          variant === 'login'
            ? (
              <div className='space-x-1'>
                <span className='text-secondary'>¿No tienes una cuenta?</span>
                <Link to={paths.auth.signup.getHref(redirectTo)} className='text-twitterBlue hover:underline'>Registrate</Link>
              </div>
            ) : (
              <div className='space-x-1'>
                <span className='text-secondary'>¿Ya tienes una cuenta?</span>
                <Link to={paths.auth.login.getHref(redirectTo)} className='text-twitterBlue hover:underline'>Iniciar sesión</Link>
              </div>
            )
        }

        {errorMsg !== '' && <p className='text-red-500 font-semibold'>{errorMsg}</p>}
      </div>
    </div>
  );
}

export default AuthLayout;
