import { CloseIcon, LeftRowIcon } from '@/assets/icons';

import type { EditProfileRenders } from '@/types/users.d.ts';

type Props =
  | { controlled: true; render: EditProfileRenders; handleSubmit: () => Promise<void>; handleClose: () => Promise<void>, isDisabled?: boolean }
  | { controlled?: false; render?: EditProfileRenders; handleSubmit?: () => Promise<void>; handleClose: () => Promise<void>, isDisabled?: boolean };

function ModalHeader({ render, controlled, handleClose, handleSubmit, isDisabled = false }: Props) {
  const isGeneralRender = render === 'general';

  return (
    <div className={`${controlled && 'flex items-center gap-6'} sticky top-0 p-2 text-primary z-10 bg-white/85 dark:bg-black/65 backdrop-blur-md`}>
      <button
        type='button'
        className='p-2 rounded-full cursor-pointer hover:bg-hoverColorSecondary transition-colors duration-200'
        onClick={handleClose}
      >
        {(isGeneralRender || !controlled) ? <CloseIcon className='size-5 fill-current' /> : <LeftRowIcon className='size-5 fill-current' />}
      </button>

      {controlled && (
        <>
          <h1 className='flex-1 text-xl font-bold'>
            {isGeneralRender ? 'Editar perfil' : 'Editar contenido multimedia'}
          </h1>

          <button
            type='button'
            className='px-4 py-1 mr-2 rounded-full cursor-pointer font-semibold text-buttonText bg-primary hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-default'
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            {isGeneralRender ? 'Guardar' : 'Aplicar'}
          </button>
        </>
      )}
    </div>
  );
}

export default ModalHeader;
