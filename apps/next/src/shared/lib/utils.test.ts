import { describe, it, expect } from 'vitest';
import { cn, round4 } from './utils';

describe('utils', () => {
  it('cn merges classes and resolves conflicts', () => {
    expect(cn('a', 'b')).toBe('a b');
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('cn handles empty, falsy, object and array inputs', () => {
    expect(cn()).toBe('');
    expect(cn(false, null, undefined, '')).toBe('');
    expect(cn({ a: true, b: false })).toBe('a');
    expect(cn(['a', 'b'])).toBe('a b');
    expect(cn('a', ['b', { c: true }], false, 'px-2', 'px-4')).toBe('a b c px-4');
  });

  it('round4 rounds to 4 decimals', () => {
    expect(round4(1.23456789)).toBe(1.2346);
    expect(round4(-1.23456789)).toBe(-1.2346);
    expect(round4(0)).toBe(0);
    expect(round4(42)).toBe(42);
  });
});
