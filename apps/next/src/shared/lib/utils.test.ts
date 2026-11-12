import { describe, it, expect } from 'vitest';
import { cn, round4 } from './utils';

describe('cn', () => {
  it('merges simple class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('ignores falsy values', () => {
    expect(cn('a', false, 'b', undefined, null)).toBe('a b');
  });

  it('resolves tailwind conflicts (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('returns empty string for no input', () => {
    expect(cn()).toBe('');
  });
});

describe('round4', () => {
  it('rounds to 4 decimal places', () => {
    expect(round4(1.23456789)).toBe(1.2346);
  });

  it('leaves integers unchanged', () => {
    expect(round4(42)).toBe(42);
  });

  it('rounds tiny decimals to zero', () => {
    expect(round4(0.00001)).toBe(0);
  });

  it('handles negative numbers', () => {
    expect(round4(-1.23456789)).toBe(-1.2346);
  });

  it('handles exactly 4 decimals without change', () => {
    expect(round4(1.2345)).toBe(1.2345);
  });
});
