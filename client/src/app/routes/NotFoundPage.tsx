import NotFound from '@/components/errors/NotFound.tsx';
import Navigation from '@/components/layouts/navigation/Navigation.tsx';

function NotFoundPage() {
  return (
    <div className='w-full flex justify-center'>
      <Navigation />

      <NotFound />
    </div>
  );
}

export default NotFoundPage;
