import { describe, it, expect } from 'vitest';
import { extractTrpcProcedurePaths, shouldSkipRefresh } from './trpc';

describe('extractTrpcProcedurePaths', () => {
  it('extracts single path', () => {
    expect(extractTrpcProcedurePaths('https://api.test/trpc/auth.login')).toEqual(['auth.login']);
  });

  it('extracts batched paths', () => {
    expect(
      extractTrpcProcedurePaths('https://api.test/trpc/auth.login,users.update,billing.checkout'),
    ).toEqual(['auth.login', 'users.update', 'billing.checkout']);
  });

  it('ignores query string', () => {
    expect(extractTrpcProcedurePaths('https://api.test/trpc/auth.login?batch=1&input=...')).toEqual(
      ['auth.login'],
    );
  });

  it('ignores hash', () => {
    expect(extractTrpcProcedurePaths('https://api.test/trpc/auth.login#section')).toEqual([
      'auth.login',
    ]);
  });

  it('returns empty array when no /trpc/ segment', () => {
    expect(extractTrpcProcedurePaths('https://api.test/other')).toEqual([]);
  });

  it('trims whitespace around paths', () => {
    expect(extractTrpcProcedurePaths('https://api.test/trpc/auth.login , users.update')).toEqual([
      'auth.login',
      'users.update',
    ]);
  });
});

describe('shouldSkipRefresh', () => {
  it('skips REST auth endpoints by URL', () => {
    expect(shouldSkipRefresh('https://api.test/auth/login')).toBe(true);
    expect(shouldSkipRefresh('https://api.test/auth/refresh')).toBe(true);
    expect(shouldSkipRefresh('https://api.test/auth/logout')).toBe(true);
  });

  it('skips single tRPC auth procedure', () => {
    expect(shouldSkipRefresh('https://api.test/trpc/auth.login')).toBe(true);
    expect(shouldSkipRefresh('https://api.test/trpc/auth.loginWith2fa')).toBe(true);
    expect(shouldSkipRefresh('https://api.test/trpc/auth.resetPassword')).toBe(true);
  });

  it('skips batched tRPC when any item is an auth procedure', () => {
    expect(shouldSkipRefresh('https://api.test/trpc/users.updatePassword,auth.logout')).toBe(true);
    expect(shouldSkipRefresh('https://api.test/trpc/billing.checkout,auth.login')).toBe(true);
  });

  it('does not skip non-auth procedures', () => {
    expect(shouldSkipRefresh('https://api.test/trpc/billing.checkout')).toBe(false);
    expect(shouldSkipRefresh('https://api.test/trpc/users.updatePassword')).toBe(false);
  });

  it('does not skip batched non-auth procedures', () => {
    expect(shouldSkipRefresh('https://api.test/trpc/billing.checkout,users.update')).toBe(false);
  });

  it('handles query string', () => {
    expect(shouldSkipRefresh('https://api.test/trpc/auth.login?batch=1&input=...')).toBe(true);
    expect(shouldSkipRefresh('https://api.test/trpc/billing.checkout?batch=1')).toBe(false);
  });

  it('returns false when URL is malformed or has no /trpc/ segment', () => {
    expect(shouldSkipRefresh('https://api.test/other/path')).toBe(false);
    expect(shouldSkipRefresh('not-a-url')).toBe(false);
    expect(shouldSkipRefresh('')).toBe(false);
  });
});
