import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@pipeline/api/trpc';
import { refreshAccessToken, notifyAuthFailure, getCsrfToken } from './authRefresh';

const API_URL = import.meta.env.VITE_API_URL;

const SKIP_REFRESH_PROCEDURES = new Set<string>([
  'auth.login',
  'auth.register',
  'auth.loginWith2fa',
  'auth.logout',
  'auth.refresh',
  'auth.requestPasswordReset',
  'auth.resetPassword',
]);

const TRPC_PATH_PATTERN = /\/trpc\/([^?#]+)/;

export const extractTrpcProcedurePaths = (url: string): string[] => {
  const match = url.match(TRPC_PATH_PATTERN);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((path) => path.trim())
    .filter((path) => path.length > 0);
};

export const shouldSkipRefresh = (url: string): boolean => {
  if (url.includes('/auth/')) return true;
  const paths = extractTrpcProcedurePaths(url);
  return paths.some((path) => SKIP_REFRESH_PROCEDURES.has(path));
};

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${API_URL}/trpc`,

      headers() {
        return { 'x-csrf-token': getCsrfToken() };
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

        if (response.status !== 401) return response;

        if (shouldSkipRefresh(url.toString())) {
          return response;
        }

        const refreshed = await refreshAccessToken();

        if (!refreshed) {
          notifyAuthFailure();
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

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
