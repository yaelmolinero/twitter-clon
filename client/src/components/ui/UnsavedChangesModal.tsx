import { useModalClose } from '@/contexts/modalCloseContext/useModalClose.ts';

interface UnsavedChangesModalProps {
  variant: 'thread' | 'profile';
}

function UnsavedChangesModal({ variant }: UnsavedChangesModalProps) {
  const { showCancelMenu, handleConfirmClose, handleCancelClose } = useModalClose();

  const message = variant === 'thread' ? '¿Quieres descartar el hilo?' : '¿Quieres descartar los cambios?';

  function handleClose(e: React.MouseEvent) {
    e.stopPropagation();
    handleCancelClose();
  }

  if (!showCancelMenu) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-modalBackground" onClick={handleClose}>
      <div className="max-w-[320px] w-full p-8 mx-4 bg-background rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h1 className='text-xl font-bold mb-2 text-primary leading-5'>{message}</h1>
        <div className='text-secondary mb-6 leading-5'>
          <span>
            {`Esta acción no se puede revertir; perderás ${variant === 'thread' ? 'tu borrador' : 'tus cambios'}.`}
          </span>
        </div>
        <div className="flex flex-col gap-3 text-center *:w-full *:py-3 *:rounded-full *:font-bold *:cursor-pointer *:transition-colors *:duration-200">
          <button
            className="text-white bg-red-500 hover:bg-red-600"
            onClick={handleConfirmClose}
          >
            Descartar
          </button>
          <button
            className="text-primary outline-1 outline-secondary hover:bg-hoverColorSecondary"
            onClick={handleCancelClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;
