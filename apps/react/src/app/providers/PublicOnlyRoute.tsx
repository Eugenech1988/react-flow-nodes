import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/shared/hooks';

export const PublicOnlyRoute = () => {
  const { isAuth, role, isLoading } = useUser();

  if (isLoading) return null; // Можно добавить GlobalLoader

  if (isAuth) {
    const isContentManager = role === 'CONTENT_MANAGER' || role === 'SUPER_ADMIN';
    return <Navigate to={isContentManager ? '/admin/jobs' : '/'} replace />;
  }

  return <Outlet />;
};
