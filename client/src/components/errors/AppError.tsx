import { useErrorBoundary } from 'react-error-boundary';
import ReloadIcon from '@/assets/icons/ReloadIcon.tsx';

function AppError() {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div className='w-full space-y-2 px-2 py-4'>
      <span className='block text-secondary text-center'>Algo salió mal. Intenta recargar.</span>
      <button
        type='button'
        onClick={resetBoundary}
        className='flex gap-2 items-center py-2 px-4 mx-auto rounded-full cursor-pointer bg-twitterBlue text-white hover:opacity-95'
      >
        <ReloadIcon className='size-6' />
        <span className='font-bold'>Intentar de nuevo</span>
      </button>
    </div>
  );
}

export default AppError;
