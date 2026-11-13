import { describe, it, expect } from 'vitest';
import { cn, round4 } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges classes', () => {
      expect(cn('a', 'b')).toBe('a b');
    });

    it('handles falsy values', () => {
      expect(cn('a', false, null, undefined)).toBe('a');
    });

    it('handles conditional object', () => {
      expect(cn({ a: true, b: false, c: true })).toBe('a c');
    });

    it('handles arrays', () => {
      expect(cn(['a', 'b', ['c']])).toBe('a b c');
    });

    it('resolves tailwind conflicts', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
      expect(cn('text-sm', 'text-lg')).toBe('text-lg');
    });

    it('returns empty string for no input', () => {
      expect(cn()).toBe('');
    });
  });

  describe('round4', () => {
    it('rounds to 4 decimal places', () => {
      expect(round4(1.23456789)).toBe(1.2346);
      expect(round4(-1.23456789)).toBe(-1.2346);
    });

    it('leaves integers unchanged', () => {
      expect(round4(42)).toBe(42);
      expect(round4(0)).toBe(0);
    });
  });
});
