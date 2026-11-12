import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { getApiUrl, trpcFetch } from './trpc';

const OK_BATCH = (data: unknown) => [{ result: { data: { json: data } } }];
const RAW_BATCH = (data: unknown) => [{ result: { data } }];

describe('getApiUrl', () => {
  const OLD_API = process.env.API_URL;
  const OLD_NEXT = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    delete process.env.API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  afterEach(() => {
    if (OLD_API !== undefined) process.env.API_URL = OLD_API;
    else delete process.env.API_URL;
    if (OLD_NEXT !== undefined) process.env.NEXT_PUBLIC_API_URL = OLD_NEXT;
    else delete process.env.NEXT_PUBLIC_API_URL;
  });

  it('returns API_URL when set', () => {
    process.env.API_URL = 'https://api.test';
    expect(getApiUrl()).toBe('https://api.test');
  });

  it('falls back to NEXT_PUBLIC_API_URL', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://next.test';
    expect(getApiUrl()).toBe('https://next.test');
  });

  it('prefers API_URL over NEXT_PUBLIC_API_URL', () => {
    process.env.API_URL = 'https://api.test';
    process.env.NEXT_PUBLIC_API_URL = 'https://next.test';
    expect(getApiUrl()).toBe('https://api.test');
  });

  it('returns null and logs when neither set', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(getApiUrl()).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      '[api] API_URL is not set (expected API_URL or NEXT_PUBLIC_API_URL)',
    );
    spy.mockRestore();
  });
});

describe('trpcFetch', () => {
  beforeEach(() => {
    process.env.API_URL = 'https://api.test';
    delete process.env.NEXT_PUBLIC_API_URL;
    mockFetch.mockReset();
  });

  it('returns ok:false when API_URL missing', async () => {
    delete process.env.API_URL;
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await trpcFetch('foo', {})).toEqual({ ok: false });
    expect(mockFetch).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('builds GET url with encoded input', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => RAW_BATCH(null) });
    await trpcFetch('test.path', { foo: 'bar' });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toBe(
      `https://api.test/trpc/test.path?batch=1&input=${encodeURIComponent(JSON.stringify({ 0: { foo: 'bar' } }))}`,
    );
  });

  it('uses cache:no-store for GET without opts.next', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => RAW_BATCH(null) });
    await trpcFetch('test.path', {});
    const init = mockFetch.mock.calls[0][1] as RequestInit;
    expect(init.cache).toBe('no-store');
  });

  it('passes next config for GET with opts.next', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => RAW_BATCH(null) });
    await trpcFetch('test.path', {}, { next: { revalidate: 60, tags: ['jobs'] } });
    const init = mockFetch.mock.calls[0][1] as RequestInit & {
      next?: { revalidate: number; tags: string[] };
    };
    expect(init.next).toEqual({ revalidate: 60, tags: ['jobs'] });
    expect(init.cache).toBeUndefined();
  });

  it('POST sends body as {0: input}', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => RAW_BATCH(null) });
    await trpcFetch('test.path', { id: 'x' }, { method: 'POST' });
    const url = mockFetch.mock.calls[0][0] as string;
    const init = mockFetch.mock.calls[0][1] as RequestInit;
    expect(url).toBe('https://api.test/trpc/test.path?batch=1');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(init.body).toBe(JSON.stringify({ 0: { id: 'x' } }));
  });

  it('returns ok:false on non-2xx', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    expect(await trpcFetch('x', {})).toEqual({ ok: false });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('returns ok:false on batch error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ error: { message: 'bad' } }],
    });
    expect(await trpcFetch('x', {})).toEqual({ ok: false });
    spy.mockRestore();
  });

  it('unwraps data.json when present', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => OK_BATCH({ id: 1 }),
    });
    expect(await trpcFetch('x', {})).toEqual({ ok: true, data: { id: 1 } });
  });

  it('returns raw data when no .json field', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => RAW_BATCH({ id: 2 }),
    });
    expect(await trpcFetch('x', {})).toEqual({ ok: true, data: { id: 2 } });
  });

  it('returns ok:false when body is not an array', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    expect(await trpcFetch('x', {})).toEqual({ ok: false });
    spy.mockRestore();
  });

  it('returns ok:false on empty batch array', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    expect(await trpcFetch('x', {})).toEqual({ ok: false });
    spy.mockRestore();
  });

  it('returns ok:false on missing result', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [{}] });
    expect(await trpcFetch('x', {})).toEqual({ ok: false });
    spy.mockRestore();
  });

  it('validates with schema when provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => RAW_BATCH({ id: 'abc' }),
    });
    const schema = z.object({ id: z.string() });
    expect(await trpcFetch('x', {}, { schema })).toEqual({ ok: true, data: { id: 'abc' } });
  });

  it('returns ok:false on schema fail', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => RAW_BATCH({ id: 1 }),
    });
    const schema = z.object({ id: z.string() });
    expect(await trpcFetch('x', {}, { schema })).toEqual({ ok: false });
    spy.mockRestore();
  });

  it('returns ok:false on fetch throw', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error('network'));
    expect(await trpcFetch('x', {})).toEqual({ ok: false });
    spy.mockRestore();
  });
});
