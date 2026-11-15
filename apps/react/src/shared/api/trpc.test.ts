import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type TFetchInit = { headers: Record<string, string>; credentials?: 'include' };
type TFetchResponse = { status: number; ok?: boolean };
type TMockLinkConfig = {
  fetch: (op: string, init: TFetchInit) => Promise<TFetchResponse>;
  headers: (() => Record<string, string>) | undefined;
};

const {
  mockLinkConfig,
  mockFetch,
  mockRefreshAccessToken,
  mockNotifyAuthFailure,
  mockGetCsrfToken,
} = vi.hoisted(() => {
  const cfg: { current: TMockLinkConfig | null } = { current: null };
  return {
    mockLinkConfig: cfg,
    mockFetch: vi.fn<(input: string, init: TFetchInit) => Promise<TFetchResponse>>(),
    mockRefreshAccessToken: vi.fn(),
    mockNotifyAuthFailure: vi.fn(),
    mockGetCsrfToken: vi.fn(() => 'token-abc'),
  };
});

vi.mock('./authRefresh', () => ({
  refreshAccessToken: mockRefreshAccessToken,
  notifyAuthFailure: mockNotifyAuthFailure,
  getCsrfToken: mockGetCsrfToken,
}));

vi.mock('@trpc/client', () => ({
  createTRPCClient: vi.fn((opts: { links: [{ config: TMockLinkConfig }] }) => {
    mockLinkConfig.current = opts.links[0].config;
    return { __opts: opts };
  }),
  httpBatchLink: vi.fn((config: TMockLinkConfig) => ({ config })),
}));

vi.mock('@trpc/tanstack-react-query', () => ({
  createTRPCContext: () => ({ TRPCProvider: () => null, useTRPC: () => ({}) }),
}));

const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  global.fetch = mockFetch as unknown as typeof global.fetch;
  mockGetCsrfToken.mockReturnValue('token-abc');
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('shouldSkipRefresh', () => {
  it('skips REST /auth/ URLs', async () => {
    const { shouldSkipRefresh } = await import('./trpc');
    expect(shouldSkipRefresh('http://x/auth/login')).toBe(true);
    expect(shouldSkipRefresh('http://x/auth/refresh')).toBe(true);
  });

  it('skips all auth tRPC procedures including auth.me', async () => {
    const { shouldSkipRefresh } = await import('./trpc');
    const procs = [
      'auth.login',
      'auth.register',
      'auth.loginWith2fa',
      'auth.logout',
      'auth.refresh',
      'auth.me',
      'auth.requestPasswordReset',
      'auth.resetPassword',
    ];
    procs.forEach((p) => {
      expect(shouldSkipRefresh(`http://x/trpc/${p}`)).toBe(true);
    });
  });

  it('skips batched tRPC with auth procedures', async () => {
    const { shouldSkipRefresh } = await import('./trpc');
    expect(shouldSkipRefresh('http://x/trpc/users.update,auth.logout')).toBe(true);
    expect(shouldSkipRefresh('http://x/trpc/billing.checkout,auth.login')).toBe(true);
    expect(shouldSkipRefresh('http://x/trpc/pipelines.list,auth.me')).toBe(true);
  });

  it('does not skip non-auth procedures', async () => {
    const { shouldSkipRefresh } = await import('./trpc');
    expect(shouldSkipRefresh('http://x/trpc/billing.checkout')).toBe(false);
    expect(shouldSkipRefresh('http://x/trpc/pipelines.list')).toBe(false);
  });

  it('returns false for empty or malformed URLs', async () => {
    const { shouldSkipRefresh } = await import('./trpc');
    expect(shouldSkipRefresh('')).toBe(false);
    expect(shouldSkipRefresh('not-a-url')).toBe(false);
  });
});

describe('extractTrpcProcedurePaths', () => {
  it('extracts single path', async () => {
    const { extractTrpcProcedurePaths } = await import('./trpc');
    expect(extractTrpcProcedurePaths('http://x/trpc/auth.login')).toEqual(['auth.login']);
  });

  it('extracts batched paths', async () => {
    const { extractTrpcProcedurePaths } = await import('./trpc');
    expect(extractTrpcProcedurePaths('http://x/trpc/a.b,c.d,e.f')).toEqual(['a.b', 'c.d', 'e.f']);
  });

  it('strips query string', async () => {
    const { extractTrpcProcedurePaths } = await import('./trpc');
    expect(extractTrpcProcedurePaths('http://x/trpc/auth.login?batch=1')).toEqual(['auth.login']);
  });

  it('strips hash', async () => {
    const { extractTrpcProcedurePaths } = await import('./trpc');
    expect(extractTrpcProcedurePaths('http://x/trpc/auth.login#section')).toEqual(['auth.login']);
  });

  it('returns empty for URL without /trpc/', async () => {
    const { extractTrpcProcedurePaths } = await import('./trpc');
    expect(extractTrpcProcedurePaths('http://x/other')).toEqual([]);
  });

  it('trims whitespace around paths', async () => {
    const { extractTrpcProcedurePaths } = await import('./trpc');
    expect(extractTrpcProcedurePaths('http://x/trpc/a.b , c.d')).toEqual(['a.b', 'c.d']);
  });
});

describe('custom fetch handler', () => {
  const getHandler = (): TMockLinkConfig['fetch'] => {
    if (!mockLinkConfig.current) throw new Error('mock link not initialized');
    return mockLinkConfig.current.fetch;
  };

  it('passes through on non-401', async () => {
    await import('./trpc');
    const handler = getHandler();
    mockFetch.mockResolvedValue({ status: 200 });

    const res = await handler('http://x/trpc/billing.checkout', { headers: {} });

    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockRefreshAccessToken).not.toHaveBeenCalled();
  });

  it('returns response unchanged for auth procedure 401', async () => {
    await import('./trpc');
    const handler = getHandler();
    const mock401 = { status: 401 };
    mockFetch.mockResolvedValue(mock401);

    const res = await handler('http://x/trpc/auth.login', { headers: {} });

    expect(res).toBe(mock401);
    expect(mockRefreshAccessToken).not.toHaveBeenCalled();
  });

  it('does not trigger refresh on auth.me 401 (prevents invalidation loop)', async () => {
    await import('./trpc');
    const handler = getHandler();
    const mock401 = { status: 401 };
    mockFetch.mockResolvedValue(mock401);

    const res = await handler('http://x/trpc/auth.me', { headers: {} });

    expect(res).toBe(mock401);
    expect(mockRefreshAccessToken).not.toHaveBeenCalled();
    expect(mockNotifyAuthFailure).not.toHaveBeenCalled();
  });

  it('refreshes and retries on 401 for non-auth procedure', async () => {
    await import('./trpc');
    const handler = getHandler();
    mockRefreshAccessToken.mockResolvedValue(true);
    mockFetch
      .mockResolvedValueOnce({ status: 401 })
      .mockResolvedValueOnce({ status: 200, ok: true });

    const res = await handler('http://x/trpc/billing.checkout', { headers: {} });

    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
    expect(mockNotifyAuthFailure).not.toHaveBeenCalled();
  });

  it('notifies auth failure and returns original response if refresh fails', async () => {
    await import('./trpc');
    const handler = getHandler();
    mockRefreshAccessToken.mockResolvedValue(false);
    const mock401 = { status: 401 };
    mockFetch.mockResolvedValue(mock401);

    const res = await handler('http://x/trpc/billing.checkout', { headers: {} });

    expect(res).toBe(mock401);
    expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
    expect(mockNotifyAuthFailure).toHaveBeenCalledTimes(1);
  });

  it('sends x-csrf-token header', async () => {
    await import('./trpc');
    const handler = getHandler();
    mockFetch.mockResolvedValue({ status: 200 });
    mockGetCsrfToken.mockReturnValue('csrf-value');

    await handler('http://x/trpc/health', { headers: {} });

    const init = mockFetch.mock.calls[0]![1];
    expect(init.headers['x-csrf-token']).toBe('csrf-value');
    expect(init.credentials).toBe('include');
  });

  it('headers() callback returns csrf token', async () => {
    await import('./trpc');
    const headersFn = mockLinkConfig.current!.headers;
    mockGetCsrfToken.mockReturnValue('csrf-from-callback');

    expect(headersFn!()).toEqual({ 'x-csrf-token': 'csrf-from-callback' });
  });
});