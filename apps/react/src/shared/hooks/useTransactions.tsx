import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';

export function useTransactions() {
  const trpc = useTRPC();
  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    ...trpc.billing.transactions.queryOptions(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    transactions: transactions ?? [],
    hasTransactions: Boolean(transactions && transactions.length > 0),
    isLoading,
    isError,
    error,
    refetch,
  };
}
