const API_URL = import.meta.env.VITE_API_URL;

const CSRF_COOKIE_PATTERN = /(?:^|;\s*)x-csrf-token=([^;]*)/;

export const getCsrfToken = (): string => {
  const match = document.cookie.match(CSRF_COOKIE_PATTERN);
  return match ? decodeURIComponent(match[1]) : '';
};

let refreshPromise: Promise<boolean> | null = null;

export const refreshAccessToken = (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'x-csrf-token': getCsrfToken() },
  })
    .then((response) => response.ok)
    .catch((error: unknown) => {
      console.error('[authRefresh] refresh failed:', error);
      return false;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export type TAuthFailureListener = () => void;

const authFailureListeners = new Set<TAuthFailureListener>();

export const onAuthFailure = (listener: TAuthFailureListener): (() => void) => {
  authFailureListeners.add(listener);
  return () => {
    authFailureListeners.delete(listener);
  };
};

export const notifyAuthFailure = (): void => {
  authFailureListeners.forEach((listener) => {
    try {
      listener();
    } catch (error: unknown) {
      console.error('[authRefresh] listener threw:', error);
    }
  });
};
