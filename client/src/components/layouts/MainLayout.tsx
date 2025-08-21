import { useLocation, Outlet } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';

import Navigation from '@/components/layouts/navigation/Navigation.tsx';
import DiscoverySidebar from '@/components/layouts/discovery/DiscoverySidebar.tsx';
import TrendingTopics from '@/components/layouts/discovery/TrendingTopics.tsx';
import UsersContainer from '@/features/user/components/UsersContainer';
import LoginFixed from '@/components/ui/LoginFixed.tsx';
import LoginCard from '@/components/ui/LoginCard.tsx';

type discoverySection = 'whoToFollow' | 'trending';

const widgetMap: Record<discoverySection, React.JSX.Element> = {
  trending: <TrendingTopics key='trending-topics-id' />,
  whoToFollow: <UsersContainer variant='normal' type='suggestions' key='who-to-follow-id' limitResult />
};

// Estas props son unicamente usadas en la pagina status (/:username/status/:tweetID)
interface Props {
  isStatus?: boolean;
  isError?: boolean;
  relevantUsers?: React.JSX.Element;
  children?: React.ReactNode;
}

function MainLayout({ isStatus = false, isError = false, relevantUsers, children }: Props) {
  const location = useLocation();
  const { isUserAuthenticated } = useUser();
  const { pathname } = location;

  const hideSearchbar = pathname === '/explore' || pathname === '/search';
  const sidebarKeys: (discoverySection)[] = pathname === '/explore' ? ['whoToFollow'] : ['trending', 'whoToFollow'];

  return (
    <div className='w-full flex flex-col movile:flex-row justify-center'>
      <Navigation />

      <main className='flex gap-7 flex-1 movile:flex-initial'>
        <div className='w-full max-w-[600px] movile:w-[600px] movile:border-x border-borderColor'>
          {isStatus ? children : <Outlet />}
        </div>

        {!isStatus && (
          <DiscoverySidebar hideSearch={hideSearchbar} >
            {isUserAuthenticated
              ? sidebarKeys.map(key => widgetMap[key])
              : <LoginCard />}
          </DiscoverySidebar>
        )}

        {/* Para el control dentro de status */}
        {isError && <div className="hidden lg:block lg:w-[290px] xl:w-[350px]"></div>}

        {(isStatus && !isError) && (
          <DiscoverySidebar>
            {relevantUsers}
            {!isUserAuthenticated && <LoginCard />}
            {isUserAuthenticated && widgetMap['trending']}
          </DiscoverySidebar>
        )}
      </main>

      {!isUserAuthenticated && <LoginFixed />}
    </div>
  );
}

export default MainLayout;
