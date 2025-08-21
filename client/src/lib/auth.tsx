import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { paths } from '@/config/paths.ts';

import { ROLES } from '@/types/users.d';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { username: usernameParam = '', tweetID = '' } = useParams();
  const guestAllowedRoutes = [
    paths.app.root.getHref(),
    paths.app.home.getHref(),
    paths.app.profile.getHref(usernameParam),
    paths.app.status.getHref(usernameParam, tweetID)
  ];

  const { session, isLoading, isStale, isError, refetch: refetchToken } = useUser();
  // Solicita un nuevo access token al backend cuando el actual expira
  useEffect(() => {
    if (!isStale) return;
    refetchToken();

  }, [isStale, refetchToken]);
  if (isLoading) return null;

  if (
    !session
    || (isStale && isError)
    || (session.role === ROLES.GUEST && !guestAllowedRoutes.includes(location.pathname))
  ) return <Navigate to={paths.auth.login.getHref(location.pathname)} replace />;

  return children;
}
