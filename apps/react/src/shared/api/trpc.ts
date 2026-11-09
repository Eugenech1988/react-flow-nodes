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
      headers: { 'x-csrf-token': getCsrfToken() },
    })
      .then((response) => response.ok)
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

type TAuthFailureListener = () => void;
const authFailureListeners = new Set<TAuthFailureListener>();

export const onAuthFailure = (listener: TAuthFailureListener): (() => void) => {
  authFailureListeners.add(listener);
  return () => {
    authFailureListeners.delete(listener);
  };
};

const notifyAuthFailure = () => {
  authFailureListeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Auth failure listener threw:', e);
    }
  });
};

const SKIP_REFRESH_PROCEDURES = [
  'auth.login',
  'auth.register',
  'auth.loginWith2fa',
  'auth.logout',
  'auth.refresh',
  'auth.requestPasswordReset',
  'auth.resetPassword',
];

const shouldSkipRefresh = (url: string): boolean => {
  if (url.includes('/auth/')) return true; // REST-эндпоинты (OAuth и т.п.)
  return SKIP_REFRESH_PROCEDURES.some((name) => url.includes(name));
};

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${apiUrl}/trpc`,

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

        const urlStr = url.toString();

        if (shouldSkipRefresh(urlStr)) {
          return response;
        }

        const refreshed = await handleTokenRefresh();

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
