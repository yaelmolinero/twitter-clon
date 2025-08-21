import { useState, useEffect, useRef } from 'react';
import Spinner from '@/components/ui/Spinner.tsx';
import { ConectionLostIcon, ReloadIcon } from '@/assets/icons';

interface Props {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

function InfinityScroll({ hasNextPage, isFetchingNextPage, fetchNextPage }: Props) {
  const [isConectionLost, setIsConectionLost] = useState(!window.navigator.onLine);
  const watcherComponent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = watcherComponent.current;
    if (!node || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    }, { root: null, rootMargin: '0px 0px 100px 0px', threshold: 0 });

    observer.observe(node);
    return () => observer.disconnect();

  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isConectionLost]);

  useEffect(() => {
    function onConectionLost() {
      setIsConectionLost(true);
    }

    window.addEventListener('offline', onConectionLost);
    return () => window.removeEventListener('offline', onConectionLost);
  }, []);

  function tryReconnect() {
    if (window.navigator.onLine) setIsConectionLost(false);
  }

  return (
    <div>
      {(hasNextPage && !isConectionLost) && <div ref={watcherComponent} className='flex justify-center items-center w-full h-40' children={<Spinner />} />}

      {isConectionLost && (
        <div className='py-8 flex flex-col justify-center items-center gap-5'>
          <div><ConectionLostIcon className='size-10 text-secondary' /></div>
          <span className='text-secondary'>Parece que se interrumpió tu conexión. Revisala e inténtalo de nuevo.</span>
          <button
            onClick={tryReconnect}
            className='flex gap-2 items-center py-2 px-4 mx-auto rounded-full cursor-pointer bg-twitterBlue text-white hover:opacity-95'
          >
            <ReloadIcon className='size-6' />
            <span className='font-bold'>Intentar de nuevo</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default InfinityScroll;
