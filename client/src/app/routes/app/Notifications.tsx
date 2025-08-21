import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useAuth.ts';
import { usePageTitle } from '@/hooks/usePageTitle.ts';
import { api } from '@/lib/api-client.ts';

import type { ApiNotificationType } from '@/types/api.d.ts';

import Notification from '@/components/ui/Notification.tsx';
import Navbar from '@/components/ui/Navbar.tsx';
import QueryFailed from '@/components/errors/QueryFailed.tsx';
import Spinner from '@/components/ui/Spinner.tsx';

type NotificationResponse = { notifications: ApiNotificationType[] };

function Notifications() {
  const { session } = useUser();

  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const result = await api.get<NotificationResponse>('/notifications', { auth: session?.token });
      return result.notifications;
    }
  });

  usePageTitle('Notificaciones - Twitter Clon');

  if (isError) return <QueryFailed isRefetching={isRefetching} retryFn={refetch} />;
  if (isLoading || !data) return <Spinner loadingContainer />;

  return (
    <div>
      <Navbar type='header' label='Notificaciones' />

      <div className='w-full'>
        {data.map(noti => <Notification {...noti} key={noti.id} />)}
      </div>
    </div>
  );
}

export default Notifications;
