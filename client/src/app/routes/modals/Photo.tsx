import { useLocation } from 'react-router';
import ProfileImage from '@/components/ui/ProfileImage.tsx';
import { CloseIcon } from '@/assets/icons';

import type { UserBasic } from '@/types/users.d.ts';

function Photo() {
  const location = useLocation();

  const user = (location.state as { user?: UserBasic })?.user;
  if (user == undefined) return null;

  return (
    <div className='w-full h-dvh flex justify-center items-center'>
      <div onClick={(e) => e.stopPropagation()}>
        <ProfileImage user={user} size='size-90' disabled disableUserPopup />
      </div>

      <div className='absolute top-5 left-5'>
        <button
          aria-label='Cerrar la imagen'
          className='p-2 rounded-full text-white cursor-pointer bg-black/50 hover:bg-hoverColorSecondary transition-colors duration-200'
          children={<CloseIcon className='size-5' />}
        />
      </div>
    </div>
  );
}

export default Photo;
