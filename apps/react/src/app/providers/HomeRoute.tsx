import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/shared/hooks';
import { GlobalLoader } from '@/shared/ui';

export const HomeRoute = () => {
  const { isLoading, role } = useUser();

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (role === 'CONTENT_MANAGER') {
    return <Navigate to="/admin/jobs" replace />;
  }

  return <Outlet />;
};
