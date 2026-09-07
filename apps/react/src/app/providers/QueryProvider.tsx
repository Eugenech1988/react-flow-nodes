import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TRPCProvider, trpcClient } from '@/shared/api';

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
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
      })
  );

  useEffect(() => {
    const initializeCsrf = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/csrf-token`, {
          credentials: 'include',
        });
      } catch (error) {
        console.error('Csrf token not initialized:', error);
      }
    };
    initializeCsrf();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
};
