const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let isRefreshing = false;
let refreshSubscribers: ((error?: Error) => void)[] = [];

const subscribeTokenRefresh = (cb: (error?: Error) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (error?: Error) => {
  refreshSubscribers.forEach((cb) => cb(error));
  refreshSubscribers = [];
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  responseType: 'json' | 'blob' = 'json',
): Promise<T> => {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    if (endpoint === '/auth/refresh') {
      isRefreshing = false;
      onRefreshed(new Error('Unauthorized'));
      throw new Error('Unauthorized');
    }

    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        subscribeTokenRefresh((error) => {
          if (error) {
            reject(error);
          } else {
            resolve(request<T>(endpoint, options, responseType));
          }
        });
      });
    }

    isRefreshing = true;

    try {
      await request('/auth/refresh', { method: 'POST' });
      isRefreshing = false;
      onRefreshed();
      return await request<T>(endpoint, options, responseType);
    } catch (err) {
      isRefreshing = false;
      const authError = err instanceof Error ? err : new Error('Unauthorized');
      onRefreshed(authError);
      throw authError;
    }
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    const errorMessage =
      typeof errorData.message === 'string' ? errorData.message : 'API Error';

    throw new Error(errorMessage);
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
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  getBlob: (endpoint: string, options?: RequestInit) =>
    request<Blob>(
      endpoint,
      {
        ...options,
        method: 'GET',
      },
      'blob',
    ),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    }),
};