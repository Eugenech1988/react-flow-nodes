import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/shared/hooks';

export const PublicOnlyRoute = () => {
  const { isAuth } = useUser();

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};