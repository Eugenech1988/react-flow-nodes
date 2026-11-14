import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  TTERMINAL_KEYS,
  getTerminalValue,
  type TNodeExecutionResult,
  type TTerminalKey,
} from './types';

describe('TTERMINAL_KEYS', () => {
  it('exports 7 terminal keys', () => {
    expect(TTERMINAL_KEYS).toHaveLength(7);
  });

  it('contains expected keys', () => {
    expect(TTERMINAL_KEYS).toContain('value');
    expect(TTERMINAL_KEYS).toContain('text');
    expect(TTERMINAL_KEYS).toContain('imageUrl');
    expect(TTERMINAL_KEYS).toContain('rows');
  });

  it('has consistent literal type', () => {
    expectTypeOf<TTerminalKey>().toEqualTypeOf<(typeof TTERMINAL_KEYS)[number]>();
  });
});

describe('getTerminalValue', () => {
  it('prefers value over other keys', () => {
    expect(getTerminalValue({ value: 'v', text: 't' })).toBe('v');
  });

  it('falls back to result', () => {
    expect(getTerminalValue({ result: 'r' })).toBe('r');
  });

  it('falls back to text', () => {
    expect(getTerminalValue({ text: 't' })).toBe('t');
  });

  it('falls back to response', () => {
    expect(getTerminalValue({ response: 'resp' })).toBe('resp');
  });

  it('falls back to imageUrl', () => {
    expect(getTerminalValue({ imageUrl: 'http://img' })).toBe('http://img');
  });

  it('falls back to rows', () => {
    expect(getTerminalValue({ rows: [1, 2] })).toEqual([1, 2]);
  });

  it('falls back to inputValue', () => {
    expect(getTerminalValue({ inputValue: 'iv' })).toBe('iv');
  });

  it('skips null', () => {
    expect(getTerminalValue({ value: null, text: 't' })).toBe('t');
  });

  it('skips undefined', () => {
    expect(getTerminalValue({ value: undefined, text: 't' })).toBe('t');
  });

  it('returns whole object when no terminal key', () => {
    const output: TNodeExecutionResult = { customField: 'x' };
    expect(getTerminalValue(output)).toBe(output);
  });

  it('returns empty object when passed empty', () => {
    expect(getTerminalValue({})).toEqual({});
  });
});
