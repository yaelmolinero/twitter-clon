import { useLocation } from 'react-router';
import { CloseIcon } from '@/assets/icons';

import type { UserPublicProfile } from '@/types/users.d.ts';

function Cover() {
  const location = useLocation();

  const user = (location.state as { user?: UserPublicProfile })?.user;
  if (user == undefined) return null;
  const { cover, username } = user;

  return (
    <div className='w-full h-dvh flex justify-center items-center'>
      <img
        src={cover as string}
        alt={`Imagen de portada de ${username}`}
        className="w-full h-auto max-h-dvh object-contain"
        onClick={(e) => e.stopPropagation()}
      />

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

export default Cover;
