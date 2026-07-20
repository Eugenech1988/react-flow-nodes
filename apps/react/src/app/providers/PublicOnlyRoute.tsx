import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/features/auth';

export const PublicOnlyRoute = () => {
  const { isLoading, isAuth } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-zinc-400 flex items-center justify-center">
        <div className="animate-pulse tracking-wider text-sm">LOADING WORKSPACE...</div>
      </div>
    );
  }

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};