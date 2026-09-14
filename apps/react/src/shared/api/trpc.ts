import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@pipeline/api/trpc';

const apiUrl = import.meta.env.VITE_API_URL;

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)x-csrf-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

let refreshPromise: Promise<boolean> | null = null;

function handleTokenRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'x-csrf-token': getCsrfToken(),
      },
    })
      .then((response) => {
        console.log('REFRESH RESPONSE:', response.status);
        return response.ok;
      })
      .catch((error) => {
        console.error('REFRESH ERROR:', error);
        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
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

      async fetch(url, options) {
        const requestOptions: RequestInit = {
          ...options,
          credentials: 'include',
          headers: {
            ...options?.headers,
            'x-csrf-token': getCsrfToken(),
          },
        };

        const response = await fetch(url, requestOptions);

        if (response.status !== 401) {
          return response;
        }

        if (url.toString().includes('/auth/')) {
          return response;
        }

        const refreshed = await handleTokenRefresh();

        if (!refreshed) {
          window.location.href = '/login';
          return response;
        }

        return fetch(url, {
          ...requestOptions,
          credentials: 'include',
          headers: {
            ...requestOptions.headers,
            'x-csrf-token': getCsrfToken(),
          },
        });
      },
    }),
  ],
});

export const { TRPCProvider, useTRPC } =
  createTRPCContext<AppRouter>();