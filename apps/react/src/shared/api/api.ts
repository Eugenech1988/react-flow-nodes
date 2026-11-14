import { refreshAccessToken, notifyAuthFailure, getCsrfToken } from './authRefresh';

const BASE_URL = import.meta.env.VITE_API_URL;

const parseErrorMessage = async (response: Response): Promise<string> => {
  const data: unknown = await response.json().catch(() => ({}));

  if (typeof data === 'object' && data !== null && 'message' in data) {
    const message = (data as { message: unknown }).message;
    if (typeof message === 'string' && message.length > 0) return message;
  }

  return 'API Error';
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  responseType: 'json' | 'blob' = 'json',
  isRetry = false,
): Promise<T> => {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      'x-csrf-token': getCsrfToken(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    if (isRetry) {
      notifyAuthFailure();
      throw new Error('Unauthorized');
    }

    const refreshed = await refreshAccessToken();

    if (!refreshed) {
      notifyAuthFailure();
      throw new Error('Unauthorized');
    }

    return request<T>(endpoint, options, responseType, true);
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  if (responseType === 'blob') {
    return (await response.blob()) as T;
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return {} as T;
};

export const api = {
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  getBlob: (endpoint: string, options?: RequestInit): Promise<Blob> =>
    request<Blob>(endpoint, { ...options, method: 'GET' }, 'blob'),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
