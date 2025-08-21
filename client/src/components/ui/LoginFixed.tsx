import { Link } from 'react-router';
import { paths } from '@/config/paths.ts';

function LoginFixed() {
  return (
    <div className='fixed inset-x-0 bottom-0 bg-twitterBlue z-20'>
      <div className='flex max-w-200 w-full justify-between items-center p-3 mx-auto text-white leading-5'>
        <div className='hidden md:block *:block'>
          <span className='text-2xl font-bold'>Estas navegando como invitado</span>
          <span>Inicia sesión para disfrutar de la experiencia completa</span>
        </div>

        <div className='flex w-full md:w-auto gap-4 *:py-2 *:px-4 *:rounded-full *:font-bold *:duration-200'>
          <Link
            to={paths.auth.login.getHref()}
            className='flex-1 md:flex-none text-center outline-1 outline-white/20 hover:bg-white/10 transition-color'
          >Iniciar sesión</Link>

          <Link
            to={paths.auth.signup.getHref()}
            className='flex-1 md:flex-none text-center text-black bg-white hover:opacity-90 transition-opacity'
          >Regístrarse</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginFixed;
