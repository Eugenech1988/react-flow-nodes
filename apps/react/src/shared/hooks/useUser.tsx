import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';

export function useUser() {
  const trpc = useTRPC();
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    ...trpc.auth.me.queryOptions(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: user ?? null,
    isAuth: !!user,
    isProActive: user?.subscription?.plan === 'PRO' && user?.subscription?.planStatus === 'ACTIVE',
    isLoading,
    isError,
    error,
  };
}
