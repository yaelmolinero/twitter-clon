import Spinner from '@/components/ui/Spinner.tsx';
import { ReloadIcon } from '@/assets/icons';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

interface Props<T> {
  isRefetching: boolean;
  retryFn: (options?: RefetchOptions) => Promise<QueryObserverResult<T, Error>>;
}

function QueryFailed<T>({ isRefetching, retryFn }: Props<T>) {
  if (isRefetching) return <Spinner loadingContainer />;

  return (
    <div className='w-full space-y-2 px-2 py-4'>
      <span className='block text-secondary text-center'>Algo salió mal. Intenta recargar.</span>
      <button
        type='button'
        onClick={() => retryFn()}
        className='flex gap-2 items-center py-2 px-4 mx-auto rounded-full cursor-pointer bg-twitterBlue text-white hover:opacity-95'
      >
        <ReloadIcon className='size-6' />
        <span className='font-bold'>Intentar de nuevo</span>
      </button>
    </div>
  );
}

export default QueryFailed;
