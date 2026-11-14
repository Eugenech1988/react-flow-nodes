import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TRPCProvider, trpcClient } from '@/shared/api';
import { AuthFailureHandler } from './AuthFailureHandler';

interface QueryProviderProps {
  children: ReactNode;
}

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
        {/* istanbul ignore next — dev-only, import.meta.env.DEV resolved at build time */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
};
