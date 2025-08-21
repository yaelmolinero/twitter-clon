import { Link } from 'react-router';
import { paths } from '@/config/paths.ts';

export function NotFound() {
  return (
    <main className='flex-1 w-full md:max-w-[600px] lg:max-w-[990px]'>
      <div className='text-center my-20'>
        <p className='text-secondary my-6'>Esta página no existe. Intenta hacer otra búsqueda.</p>
        <Link
          to={paths.app.explore.getHref()}
          className='inline-block px-4 py-2 rounded-full bg-twitterBlue font-bold text-white hover:opacity-95 transition-opacity duration-200'
        >
          Buscar
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
