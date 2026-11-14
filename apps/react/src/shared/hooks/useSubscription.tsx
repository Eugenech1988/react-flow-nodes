import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { useUser } from './useUser';

export function useSubscription() {
  const trpc = useTRPC();
  const { isProActive } = useUser();
  const {
    data: subscription,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    ...trpc.billing.subscription.queryOptions(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    subscription: subscription ?? null,
    isProActive,
    isLoading,
    isError,
    error,
    refetch,
  };
}
