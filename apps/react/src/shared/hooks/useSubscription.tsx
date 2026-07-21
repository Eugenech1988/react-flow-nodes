import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { SUBSCRIPTION_QUERY_KEY, type TSubscription } from '@/shared/lib';

export function useSubscription() {
  const {
    data: subscription,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<TSubscription | null, Error>({
    queryKey: SUBSCRIPTION_QUERY_KEY,
    queryFn: async () => {
      try {
        return await api.get<TSubscription>('/billing/subscription');
      } catch (err: any) {
        if (err.message === 'Unauthorized') {
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error.message === 'Unauthorized') return false;
      return failureCount < 2;
    },
  });

  return {
    subscription: subscription ?? null,
    isProActive: subscription?.plan === 'PRO' && subscription?.planStatus === 'ACTIVE',
    isLoading,
    isError,
    error,
    refetch
  };
}