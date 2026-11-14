import { describe, it, expect } from 'vitest';
import { resolveStatusConfig, STATUS_CONFIG, EXTRA_STATUS_CONFIG, FALLBACK_STATUS } from './constants';

describe('resolveStatusConfig', () => {
  it('resolves success', () => {
    expect(resolveStatusConfig('success')).toBe(STATUS_CONFIG.success);
  });

  it('resolves failed', () => {
    expect(resolveStatusConfig('failed')).toBe(STATUS_CONFIG.failed);
  });

  it('resolves running', () => {
    expect(resolveStatusConfig('running')).toBe(STATUS_CONFIG.running);
  });

  it('resolves canceled (extra)', () => {
    expect(resolveStatusConfig('canceled')).toBe(EXTRA_STATUS_CONFIG.canceled);
  });

  it('falls back with custom label for unknown key', () => {
    const result = resolveStatusConfig('unknown-status');
    expect(result.label).toBe('unknown-status');
    expect(result.icon).toBe(FALLBACK_STATUS.icon);
  });

  it('returns fallback label when key empty', () => {
    const result = resolveStatusConfig('');
    expect(result.label).toBe('Unknown');
  });
});
