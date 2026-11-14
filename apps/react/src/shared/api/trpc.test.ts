import { describe, it, expect } from 'vitest';

const SKIP_REFRESH_PROCEDURES = new Set<string>([
  'auth.login',
  'auth.register',
  'auth.loginWith2fa',
  'auth.logout',
  'auth.refresh',
  'auth.requestPasswordReset',
  'auth.resetPassword',
]);

const shouldSkipRefresh = (url: string, body: BodyInit | null | undefined): boolean => {
  if (url.includes('/auth/')) return true;
  if (typeof body !== 'string') return false;

  try {
    const parsed: unknown = JSON.parse(body);
    const items: unknown[] = Array.isArray(parsed) ? parsed : [parsed];

    return items.some((item) => {
      if (typeof item !== 'object' || item === null) return false;
      const path = (item as { path?: unknown }).path;
      return typeof path === 'string' && SKIP_REFRESH_PROCEDURES.has(path);
    });
  } catch {
    return false;
  }
};

describe('shouldSkipRefresh', () => {
  it('skips REST auth endpoints by URL', () => {
    expect(shouldSkipRefresh('https://api.test/auth/login', null)).toBe(true);
    expect(shouldSkipRefresh('https://api.test/auth/refresh', null)).toBe(true);
  });

  it('skips tRPC auth procedures by path', () => {
    const body = JSON.stringify({ '0': { path: 'auth.login' } });
    expect(shouldSkipRefresh('https://api.test/trpc', body)).toBe(true);
  });

  it('skips batched tRPC when any item is an auth procedure', () => {
    const body = JSON.stringify({
      '0': { path: 'users.updatePassword' },
      '1': { path: 'auth.logout' },
    });
    expect(shouldSkipRefresh('https://api.test/trpc', body)).toBe(true);
  });

  it('does not skip non-auth procedures', () => {
    const body = JSON.stringify({ '0': { path: 'billing.checkout' } });
    expect(shouldSkipRefresh('https://api.test/trpc', body)).toBe(false);
  });

  it('does not skip when body is missing', () => {
    expect(shouldSkipRefresh('https://api.test/trpc', null)).toBe(false);
    expect(shouldSkipRefresh('https://api.test/trpc', undefined)).toBe(false);
  });

  it('does not skip when body is not a string', () => {
    expect(shouldSkipRefresh('https://api.test/trpc', new Blob(['x']))).toBe(false);
  });

  it('does not skip on malformed JSON', () => {
    expect(shouldSkipRefresh('https://api.test/trpc', 'not-json')).toBe(false);
  });

  it('does not skip when path is not a string', () => {
    const body = JSON.stringify({ '0': { path: 123 } });
    expect(shouldSkipRefresh('https://api.test/trpc', body)).toBe(false);
  });
});