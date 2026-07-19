const BASE_URL = import.meta.env.API_URL || 'http://localhost:3000';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

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
    if (endpoint === '/auth/refresh' || endpoint === '/auth/me') {
      throw new Error('Unauthorized');
    }

    try {
      await request('/auth/refresh', { method: 'POST' });
      return await request<T>(endpoint, options);
    } catch {
      throw new Error('Unauthorized');
    }
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    const errorMessage = typeof errorData.message === 'string' ? errorData.message : 'API Error';
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return {} as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};