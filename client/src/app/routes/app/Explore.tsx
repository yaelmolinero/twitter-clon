import TweetsContainer from '@/features/tweets/components/TweetsContainer.tsx';
import SearchBar from '@/components/layouts/discovery/SearchBar.tsx';
import UsersContainer from '@/features/user/components/UsersContainer.tsx';
import Divisor from '@/components/ui/Divisor.tsx';

function Explore() {

  return (
    <div>
      <div className='px-6 pt-2 pb-4 sticky top-0 bg-blur z-10'>
        <SearchBar />
      </div>

      <UsersContainer variant='normal' type='suggestions' withoutBorder limitResult />

      <Divisor />
      <h1 className='text-xl text-primary font-bold p-4'>Publicaciones para ti</h1>

      <TweetsContainer type='foryou' />
    </div>
  );
}

export default Explore;
