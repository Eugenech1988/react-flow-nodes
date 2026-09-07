import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@pipeline/api/trpc';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)x-csrf-token=([^;]*)/);
  return match ? match[1] : '';
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${apiUrl}/trpc`,
      headers() {
        return {
          'x-csrf-token': getCsrfToken(),
        };
      },
      fetch(url, options) {
        return fetch(url, { ...options, credentials: 'include' } as RequestInit);
      },
    }),
  ],
});

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();