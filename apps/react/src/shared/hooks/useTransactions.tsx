import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { TRANSACTIONS_QUERY_KEY } from '@/shared';
import type { TTransaction } from '@/shared';

export function useTransactions() {
  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<TTransaction[] | null, Error>({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: async () => {
      try {
        return await api.get<TTransaction[]>('/billing/transactions');
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
    transactions: transactions ?? [],
    hasTransactions: Boolean(transactions && transactions.length > 0),
    isLoading,
    isError,
    error,
    refetch,
  };
}