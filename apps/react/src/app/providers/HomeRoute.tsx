import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/shared/hooks';
import { GlobalLoader } from '@/shared/ui';
import { redirectByRole } from '@/shared/lib';

export const HomeRoute = () => {
  const { isLoading, role } = useUser();

  if (isLoading) {
    return <GlobalLoader />;
  }

  const target = redirectByRole(role);
  if (target !== '/') {
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
};
