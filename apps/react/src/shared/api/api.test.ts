import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  refreshAccessToken,
  notifyAuthFailure,
  getCsrfToken,
} from './authRefresh';

vi.mock('./authRefresh', () => ({
  refreshAccessToken: vi.fn(),
  notifyAuthFailure: vi.fn(),
  getCsrfToken: vi.fn(() => 'token-abc'),
}));

const mockFetch = vi.fn();
const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch as unknown as typeof fetch;
  vi.mocked(refreshAccessToken).mockResolvedValue(true);
  vi.mocked(getCsrfToken).mockReturnValue('token-abc');
});

afterEach(() => {
  global.fetch = originalFetch;
});

const importApi = async () => {
  vi.resetModules();
  return (await import('./api')).api;
};

describe('api.request', () => {
  describe('basic flows', () => {
    it('returns JSON on 200', async () => {
      const api = await importApi();
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ ok: true }),
      });

      const result = await api.get<{ ok: boolean }>('/users');
      expect(result).toEqual({ ok: true });
    });

    it('returns {} when no content-type JSON', async () => {
      const api = await importApi();
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
        headers: new Headers(),
      });

      const result = await api.get('/users');
      expect(result).toEqual({});
    });

    it('returns blob on getBlob', async () => {
      const api = await importApi();
      const blob = new Blob(['x']);
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        blob: () => Promise.resolve(blob),
      });

      const result = await api.getBlob('/file');
      expect(result).toBe(blob);
    });

    it('throws with server message on 400', async () => {
      const api = await importApi();
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Bad input' }),
      });

      await expect(api.get('/x')).rejects.toThrow('Bad input');
    });

    it('throws generic API Error on malformed error body', async () => {
      const api = await importApi();
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('no json')),
      });

      await expect(api.get('/x')).rejects.toThrow('API Error');
    });
  });

  describe('401 handling', () => {
    it('refreshes and retries once', async () => {
      const api = await importApi();
      mockFetch
        .mockResolvedValueOnce({ status: 401 })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ ok: true }),
        });

      const result = await api.get('/secure');
      expect(result).toEqual({ ok: true });
      expect(refreshAccessToken).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('throws Unauthorized when refresh fails', async () => {
      const api = await importApi();
      vi.mocked(refreshAccessToken).mockResolvedValue(false);
      mockFetch.mockResolvedValue({ status: 401 });

      await expect(api.get('/secure')).rejects.toThrow('Unauthorized');
      expect(notifyAuthFailure).toHaveBeenCalledTimes(1);
    });

    it('throws Unauthorized on retry also 401', async () => {
      const api = await importApi();
      mockFetch.mockResolvedValue({ status: 401 });

      await expect(api.get('/secure')).rejects.toThrow('Unauthorized');
      expect(refreshAccessToken).toHaveBeenCalledTimes(1);
      expect(notifyAuthFailure).toHaveBeenCalledTimes(1);
    });
  });

  describe('methods', () => {
    const setup200 = () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({}),
      });
    };

    it('POST sends JSON body', async () => {
      const api = await importApi();
      setup200();
      await api.post('/x', { a: 1 });

      const call = mockFetch.mock.calls[0][1];
      expect(call.method).toBe('POST');
      expect(call.body).toBe(JSON.stringify({ a: 1 }));
      expect(call.headers['Content-Type']).toBe('application/json');
    });

    it('POST with FormData omits content-type', async () => {
      const api = await importApi();
      setup200();
      const fd = new FormData();
      fd.append('name', 'x');
      await api.post('/x', fd);

      const call = mockFetch.mock.calls[0][1];
      expect(call.headers['Content-Type']).toBeUndefined();
      expect(call.body).toBe(fd);
    });

    it('PUT, PATCH, DELETE methods', async () => {
      const api = await importApi();
      setup200();
      await api.put('/x', { a: 1 });
      await api.patch('/x', { b: 2 });
      await api.delete('/x');

      expect(mockFetch.mock.calls[0][1].method).toBe('PUT');
      expect(mockFetch.mock.calls[1][1].method).toBe('PATCH');
      expect(mockFetch.mock.calls[2][1].method).toBe('DELETE');
    });
  });
});
