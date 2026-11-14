import { describe, expect, it } from 'vitest';
import {
  redirectByRole,
  canSeeBilling,
  resolveIsProActive,
  resolveAvatarUrl,
} from './auth';

describe('redirectByRole', () => {
  it('sends CONTENT_MANAGER to /admin/jobs', () => {
    expect(redirectByRole('CONTENT_MANAGER')).toBe('/admin/jobs');
  });

  it('sends SUPER_ADMIN to /', () => {
    expect(redirectByRole('SUPER_ADMIN')).toBe('/');
  });

  it('sends USER to /', () => {
    expect(redirectByRole('USER')).toBe('/');
  });

  it('sends null to /', () => {
    expect(redirectByRole(null)).toBe('/');
  });
});

describe('canSeeBilling', () => {
  it('returns false for CONTENT_MANAGER', () => {
    expect(canSeeBilling('CONTENT_MANAGER')).toBe(false);
  });

  it('returns true for SUPER_ADMIN', () => {
    expect(canSeeBilling('SUPER_ADMIN')).toBe(true);
  });

  it('returns true for USER', () => {
    expect(canSeeBilling('USER')).toBe(true);
  });

  it('returns true for null', () => {
    expect(canSeeBilling(null)).toBe(true);
  });
});

describe('resolveIsProActive', () => {
  it('true for PRO + ACTIVE', () => {
    expect(resolveIsProActive({ plan: 'PRO', planStatus: 'ACTIVE' })).toBe(true);
  });

  it('false for PRO + CANCELED', () => {
    expect(resolveIsProActive({ plan: 'PRO', planStatus: 'CANCELED' })).toBe(false);
  });

  it('false for PRO + PAST_DUE', () => {
    expect(resolveIsProActive({ plan: 'PRO', planStatus: 'PAST_DUE' })).toBe(false);
  });

  it('false for PRO + TRIALING', () => {
    expect(resolveIsProActive({ plan: 'PRO', planStatus: 'TRIALING' })).toBe(false);
  });

  it('false for FREE + ACTIVE', () => {
    expect(resolveIsProActive({ plan: 'FREE', planStatus: 'ACTIVE' })).toBe(false);
  });

  it('false for ENTERPRISE + ACTIVE', () => {
    expect(resolveIsProActive({ plan: 'ENTERPRISE', planStatus: 'ACTIVE' })).toBe(false);
  });

  it('false for null', () => {
    expect(resolveIsProActive(null)).toBe(false);
  });

  it('false for undefined', () => {
    expect(resolveIsProActive(undefined)).toBe(false);
  });

  it('false for empty object', () => {
    expect(resolveIsProActive({})).toBe(false);
  });

  it('false when plan missing', () => {
    expect(resolveIsProActive({ planStatus: 'ACTIVE' })).toBe(false);
  });

  it('false when planStatus missing', () => {
    expect(resolveIsProActive({ plan: 'PRO' })).toBe(false);
  });
});

describe('resolveAvatarUrl', () => {
  it('returns null for null', () => {
    expect(resolveAvatarUrl(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(resolveAvatarUrl(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(resolveAvatarUrl('')).toBeNull();
  });

  it('passes through http URL', () => {
    expect(resolveAvatarUrl('http://cdn.test/a.png')).toBe('http://cdn.test/a.png');
  });

  it('passes through https URL', () => {
    expect(resolveAvatarUrl('https://cdn.test/a.png')).toBe('https://cdn.test/a.png');
  });

  it('passes through blob URL', () => {
    expect(resolveAvatarUrl('blob:http://x/y')).toBe('blob:http://x/y');
  });

  it('passes through data URL', () => {
    expect(resolveAvatarUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
  });

  it('prefixes relative path with BASE_URL', () => {
    expect(resolveAvatarUrl('/uploads/a.png')).toMatch(/\/uploads\/a\.png$/);
  });

  it('prefixes relative path without leading slash', () => {
    expect(resolveAvatarUrl('uploads/a.png')).toMatch(/uploads\/a\.png$/);
  });
});
