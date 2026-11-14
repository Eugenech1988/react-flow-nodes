import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from './api';
import * as authRefresh from './authRefresh';

const mockFetch = vi.fn();
const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch as unknown as typeof fetch;
  vi.spyOn(authRefresh, 'refreshAccessToken').mockResolvedValue(true);
  vi.spyOn(authRefresh, 'notifyAuthFailure').mockImplementation(() => {});
  vi.spyOn(authRefresh, 'getCsrfToken').mockReturnValue('token');
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('api.get', () => {
  it('returns parsed JSON on 200', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ id: '1' }),
    });

    const result = await api.get<{ id: string }>('/users/1');

    expect(result).toEqual({ id: '1' });
  });

  it('throws on non-ok with server message', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Bad input' }),
    });

    await expect(api.get('/x')).rejects.toThrow('Bad input');
  });

  it('throws generic message when server does not return JSON', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('invalid json')),
    });

    await expect(api.get('/x')).rejects.toThrow('API Error');
  });
});

describe('api 401 handling', () => {
  it('refreshes and retries once on 401', async () => {
    mockFetch
      .mockResolvedValueOnce({ status: 401 })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ ok: true }),
      });

    const result = await api.get<{ ok: boolean }>('/secure');

    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(authRefresh.refreshAccessToken).toHaveBeenCalledTimes(1);
  });

  it('throws and notifies auth failure when refresh fails', async () => {
    vi.mocked(authRefresh.refreshAccessToken).mockResolvedValue(false);
    mockFetch.mockResolvedValue({ status: 401 });

    await expect(api.get('/secure')).rejects.toThrow('Unauthorized');

    expect(authRefresh.notifyAuthFailure).toHaveBeenCalledTimes(1);
  });

  it('throws and notifies when retry after refresh also returns 401', async () => {
    mockFetch.mockResolvedValue({ status: 401 });

    await expect(api.get('/secure')).rejects.toThrow('Unauthorized');

    expect(authRefresh.refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(authRefresh.notifyAuthFailure).toHaveBeenCalledTimes(1);
  });
});

describe('api.getBlob', () => {
  it('returns blob', async () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' });
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      blob: () => Promise.resolve(blob),
    });

    const result = await api.getBlob('/invoice');

    expect(result).toBe(blob);
  });
});