import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/shared/hooks';
import { redirectByRole } from '@/shared/lib';

export const PublicOnlyRoute = () => {
  const { isAuth, role } = useUser();

  if (isAuth) {
    return <Navigate to={redirectByRole(role)} replace />;
  }

  return <Outlet />;
};
