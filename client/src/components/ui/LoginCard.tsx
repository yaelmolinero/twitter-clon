import { Link } from 'react-router';
import { paths } from '@/config/paths.ts';

function LoginCard() {
  return (
    <div className='border border-borderColor rounded-2xl px-4 py-3 space-y-3'>
      <h1 className='text-xl text-primary font-bold'>¿Eres nuevo en la app?</h1>
      <span className='block text-secondary text-sm'>Regístrate ahora para obtener la experiencia completa.</span>

      <div className='pb-1 space-y-3 *:block *:w-full *:py-2 *:px-4 *:rounded-full *:font-bold *:duration-200'>
        <Link
          to={paths.auth.login.getHref()}
          className='text-center text-white outline-1 outline-white/20 hover:bg-white/10 transition-color'
        >Iniciar sesión</Link>

        <Link
          to={paths.auth.signup.getHref()}
          className='text-center text-black bg-white hover:opacity-90 transition-opacity'
        >Regístrarse</Link>
      </div>
    </div>
  );
}

export default LoginCard;
