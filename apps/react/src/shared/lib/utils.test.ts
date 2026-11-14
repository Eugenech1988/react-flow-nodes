import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  debounce,
  extractVariables,
  formatDuration,
  formatDate,
  formatTimestamp,
} from './utils';

describe('cn', () => {
  it('merges classes', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('handles falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('merges tailwind conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles conditional objects', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls fn after delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cancels previous calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 50);

    debounced('a', 'b');
    vi.advanceTimersByTime(50);

    expect(fn).toHaveBeenCalledWith('a', 'b');
  });
});

describe('extractVariables', () => {
  it('extracts {{name}} variables', () => {
    expect(extractVariables('Hello {{name}}')).toEqual(['name']);
  });

  it('extracts multiple variables', () => {
    expect(extractVariables('{{a}} {{b}} {{c}}')).toEqual(['a', 'b', 'c']);
  });

  it('deduplicates', () => {
    expect(extractVariables('{{name}} {{name}}')).toEqual(['name']);
  });

  it('handles whitespace', () => {
    expect(extractVariables('{{  name  }}')).toEqual(['name']);
  });

  it('returns empty for no matches', () => {
    expect(extractVariables('no variables here')).toEqual([]);
  });

  it('accepts $ and _ in names', () => {
    expect(extractVariables('{{$var}} {{_x}}')).toEqual(['$var', '_x']);
  });
});

describe('formatDuration', () => {
  it('formats 0', () => {
    expect(formatDuration(0)).toBe('00:00.00');
  });

  it('formats null', () => {
    expect(formatDuration(null)).toBe('00:00.00');
  });

  it('formats undefined', () => {
    expect(formatDuration(undefined)).toBe('00:00.00');
  });

  it('formats NaN', () => {
    expect(formatDuration(NaN)).toBe('00:00.00');
  });

  it('formats 1500ms → 00:01.50', () => {
    expect(formatDuration(1500)).toBe('00:01.50');
  });

  it('formats 65000ms → 01:05.00', () => {
    expect(formatDuration(65000)).toBe('01:05.00');
  });
});

describe('formatDate', () => {
  beforeEach(() => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns — for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns — for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('returns — for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });

  it('formats ISO string', () => {
    const result = formatDate('2024-06-15T10:30:00Z');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('formats number timestamp', () => {
    const result = formatDate(Date.UTC(2024, 5, 15, 10, 30));
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('formats Date object', () => {
    const result = formatDate(new Date('2024-06-15T10:30:00Z'));
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('omits time when showTime is false', () => {
    const result = formatDate('2024-06-15T10:30:00Z', { showTime: false });
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});

describe('formatTimestamp', () => {
  beforeEach(() => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty for falsy', () => {
    expect(formatTimestamp(0)).toBe('');
    expect(formatTimestamp('')).toBe('');
  });

  it('formats number', () => {
    const result = formatTimestamp(Date.UTC(2024, 5, 15, 10, 30, 45));
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('formats numeric string', () => {
    const ts = Date.UTC(2024, 5, 15, 10, 30, 45);
    const result = formatTimestamp(String(ts));
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('formats ISO string', () => {
    const result = formatTimestamp('2024-06-15T10:30:45Z');
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('returns original string when unparseable', () => {
    expect(formatTimestamp('not-a-date')).toBe('not-a-date');
  });
});
