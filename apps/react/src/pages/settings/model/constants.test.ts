import { describe, expect, it } from 'vitest';
import { SETTINGS_TABS } from './constants';

describe('SETTINGS_TABS', () => {
  it('returns profile and account for CONTENT_MANAGER (no billing)', () => {
    const tabs = SETTINGS_TABS(false, 'CONTENT_MANAGER');
    expect(tabs.map((t) => t.id)).toEqual(['profile', 'account']);
  });

  it('returns profile, account, billing for USER', () => {
    const tabs = SETTINGS_TABS(false, 'USER');
    expect(tabs.map((t) => t.id)).toEqual(['profile', 'account', 'billing']);
  });

  it('returns billing for SUPER_ADMIN', () => {
    const tabs = SETTINGS_TABS(false, 'SUPER_ADMIN');
    expect(tabs.map((t) => t.id)).toEqual(['profile', 'account', 'billing']);
  });

  it('shows PRO badge on billing for pro user', () => {
    const tabs = SETTINGS_TABS(true, 'USER');
    const billing = tabs.find((t) => t.id === 'billing');
    expect(billing?.badge).toBe('PRO');
  });

  it('no PRO badge for free user', () => {
    const tabs = SETTINGS_TABS(false, 'USER');
    const billing = tabs.find((t) => t.id === 'billing');
    expect(billing?.badge).toBeUndefined();
  });

  it('treats null role as non-manager (billing visible)', () => {
    const tabs = SETTINGS_TABS(false, null);
    expect(tabs.map((t) => t.id)).toEqual(['profile', 'account', 'billing']);
  });
});
