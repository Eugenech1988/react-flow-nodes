import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { refreshAccessToken, onAuthFailure, notifyAuthFailure, getCsrfToken } from './authRefresh';

const mockFetch = vi.fn();
const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch as unknown as typeof fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('getCsrfToken', () => {
  it('returns empty string when cookie is absent', () => {
    Object.defineProperty(document, 'cookie', { value: '', configurable: true });
    expect(getCsrfToken()).toBe('');
  });

  it('extracts token from cookie', () => {
    Object.defineProperty(document, 'cookie', {
      value: 'foo=bar; x-csrf-token=abc123; baz=qux',
      configurable: true,
    });
    expect(getCsrfToken()).toBe('abc123');
  });

  it('decodes URI-encoded token', () => {
    Object.defineProperty(document, 'cookie', {
      value: 'x-csrf-token=hello%20world',
      configurable: true,
    });
    expect(getCsrfToken()).toBe('hello world');
  });
});

describe('refreshAccessToken', () => {
  it('returns true on successful refresh', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    const result = await refreshAccessToken();

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      expect.objectContaining({ method: 'POST', credentials: 'include' }),
    );
  });

  it('returns false on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false });

    const result = await refreshAccessToken();

    expect(result).toBe(false);
  });

  it('returns false on network error', async () => {
    mockFetch.mockRejectedValue(new Error('network down'));

    const result = await refreshAccessToken();

    expect(result).toBe(false);
  });

  it('deduplicates concurrent calls into a single fetch', async () => {
    let resolveFetch: (value: { ok: boolean }) => void = () => {};
    mockFetch.mockReturnValue(
      new Promise<{ ok: boolean }>((resolve) => {
        resolveFetch = resolve;
      }),
    );

    const p1 = refreshAccessToken();
    const p2 = refreshAccessToken();
    const p3 = refreshAccessToken();

    resolveFetch({ ok: true });

    const results = await Promise.all([p1, p2, p3]);

    expect(results).toEqual([true, true, true]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('allows a new refresh after previous one settles', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    await refreshAccessToken();
    await refreshAccessToken();

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('allows new refresh after failed one settles', async () => {
    mockFetch.mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce({ ok: true });

    const first = await refreshAccessToken();
    const second = await refreshAccessToken();

    expect(first).toBe(false);
    expect(second).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('onAuthFailure / notifyAuthFailure', () => {
  it('notifies all subscribed listeners', () => {
    const l1 = vi.fn();
    const l2 = vi.fn();

    const unsub1 = onAuthFailure(l1);
    const unsub2 = onAuthFailure(l2);

    notifyAuthFailure();

    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);

    unsub1();
    unsub2();
  });

  it('stops notifying after unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = onAuthFailure(listener);

    notifyAuthFailure();
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    notifyAuthFailure();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('isolates listener errors so others still fire', () => {
    const bad = vi.fn(() => {
      throw new Error('boom');
    });
    const good = vi.fn();

    const unsub1 = onAuthFailure(bad);
    const unsub2 = onAuthFailure(good);

    expect(() => notifyAuthFailure()).not.toThrow();
    expect(good).toHaveBeenCalledTimes(1);

    unsub1();
    unsub2();
  });
});
