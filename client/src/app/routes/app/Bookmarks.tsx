import { useUser } from '@/hooks/useAuth.ts';
import { usePageTitle } from '@/hooks/usePageTitle.ts';

import Navbar from '@/components/ui/Navbar.tsx';
import TweetsContainer from '@/features/tweets/components/TweetsContainer.tsx';

function Bookmarks() {
  const { session } = useUser();
  usePageTitle('Guardados');

  if (!session || !session.user) return null;

  return (
    <div>
      <Navbar type='navigation' label='Guardados' />
      <TweetsContainer type='bookmarkedByUser' username={session.user.username} cacheMinutes={5} />
    </div>
  );
}

export default Bookmarks;
