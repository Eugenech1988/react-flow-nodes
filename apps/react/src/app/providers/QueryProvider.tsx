import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TRPCProvider, trpcClient, useTRPC, onAuthFailure } from '@/shared/api';

interface QueryProviderProps {
  children: ReactNode;
}

const AuthFailureHandler = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  useEffect(() => {
    return onAuthFailure(() => {
      queryClient.setQueryData(trpc.auth.me.queryKey(), null);
      queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
    });
  }, [queryClient, trpc]);

  return null;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <AuthFailureHandler />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
};
