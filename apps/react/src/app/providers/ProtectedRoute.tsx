import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/shared/hooks';
import { GlobalLoader } from '@/shared/ui/GlobalLoader.tsx';

export const ProtectedRoute = () => {
  const { isLoading, isAuth } = useUser();

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};