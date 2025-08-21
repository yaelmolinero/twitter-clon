import { useParams } from 'react-router';
import { usePageTitle } from '@/hooks/usePageTitle.ts';
import Navbar from '@/components/ui/Navbar.tsx';

function ProfileNotFound() {
  const { username } = useParams();
  usePageTitle(`@${username}`);

  return (
    <div>
      <Navbar type="navigation" label="Perfil" />

      <div>
        <div className="w-full h-[200px] bg-borderColor"></div>

        <div className='px-4 pt-3'>
          <div className='flex relative justify-end h-fit mb-3'>
            <div className='absolute left-0 -bottom-1/5 size-35 border-4 border-background rounded-full bg-[#f7f9f9] dark:bg-[#16181C]'></div>

            <div className='h-11'></div>
          </div>

          <div className='py-3 leading-5'>
            <div>
              <span className='font-bold text-primary text-xl'>@{username}</span>
            </div>
          </div>

          <div className='flex items-center justify-center h-50'>
            <div className='text-start space-y-2 **:block'>
              <span className='font-bold text-4xl text-primary'>Esta cuenta no existe</span>
              <span className='text-secondary'>Intenta hacer otra búsqueda.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileNotFound;
