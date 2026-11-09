import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/shared/hooks';
import { GlobalLoader } from '@/shared/ui';

type TRole = 'USER' | 'CONTENT_MANAGER' | 'SUPER_ADMIN';

interface RoleGuardProps {
  allowedRoles: TRole[];
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { isLoading, isAuth, role } = useUser();

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role as TRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
