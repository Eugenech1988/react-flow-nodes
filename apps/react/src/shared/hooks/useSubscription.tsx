import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';

export function useSubscription() {
  const trpc = useTRPC();
  const {
    data: subscription,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    ...trpc.billing.subscription.queryOptions(),
    staleTime: 5 * 60 * 1000,
    retry: false,
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
