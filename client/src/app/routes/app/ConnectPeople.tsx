import UsersContainer from '@/features/user/components/UsersContainer.tsx';
import Navbar from '@/components/ui/Navbar.tsx';

function ConnectPeople() {
  return (
    <div>
      <Navbar type='navigation' label='Conectar' />

      <UsersContainer type='suggestions' variant='detailed' withoutBorder />
    </div>
  );
}

export default ConnectPeople;
