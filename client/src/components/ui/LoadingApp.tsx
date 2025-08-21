import XIcon from '@/assets/icons/XIcon.tsx';

function LoadingApp() {
  return (
    <div className='flex h-dvh bg-background justify-center items-center'>
      <div>
        <XIcon className='size-20 text-primary animate-pulse' />
      </div>
    </div>
  );
}

export default LoadingApp;
