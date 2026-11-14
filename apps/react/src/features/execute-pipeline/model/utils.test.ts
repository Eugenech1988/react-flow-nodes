import { describe, it, expect } from 'vitest';
import { resolveTemplate, toNumber, getNodeKind, mapTriggerType, formatLogsToRecord } from './utils';
import type { TPipelineNode } from '@/entities';

describe('utils', () => {
  describe('resolveTemplate', () => {
    it('replaces single variable', () => {
      expect(resolveTemplate('Hello {{name}}', { name: 'World' })).toBe('Hello World');
    });
    it('replaces multiple variables', () => {
      expect(resolveTemplate('{{a}} + {{b}}', { a: '1', b: '2' })).toBe('1 + 2');
    });
    it('handles missing variables gracefully', () => {
      expect(resolveTemplate('{{missing}}', {})).toBe('');
    });
    it('handles whitespace inside braces', () => {
      expect(resolveTemplate('{{  name  }}', { name: 'X' })).toBe('X');
    });
  });

  describe('toNumber', () => {
    it('returns number for valid string', () => {
      expect(toNumber('42', 'Test')).toBe(42);
    });
    it('returns number for number', () => {
      expect(toNumber(3.14, 'Test')).toBe(3.14);
    });
    it('throws on non-numeric input', () => {
      expect(() => toNumber('abc', 'Label')).toThrow('Label must be a valid number.');
    });
    it('throws on NaN input', () => {
      expect(() => toNumber(NaN, 'Label')).toThrow('Label must be a valid number.');
    });
  });

  describe('getNodeKind', () => {
    it('returns lowercased nodeType', () => {
      const node = { data: { nodeType: 'CustomInput' }, type: 'x' } as unknown as TPipelineNode;
      expect(getNodeKind(node)).toBe('custominput');
    });
    it('falls back to type', () => {
      const node = { data: {}, type: 'MyType' } as unknown as TPipelineNode;
      expect(getNodeKind(node)).toBe('mytype');
    });
    it('returns empty string if neither', () => {
      const node = { data: {} } as unknown as TPipelineNode;
      expect(getNodeKind(node)).toBe('');
    });
  });

  describe('mapTriggerType', () => {
    it('maps SCHEDULED to CRON', () => {
      expect(mapTriggerType('SCHEDULED')).toBe('CRON');
    });
    it('passes WEBHOOK', () => {
      expect(mapTriggerType('WEBHOOK')).toBe('WEBHOOK');
    });
    it('passes API', () => {
      expect(mapTriggerType('API')).toBe('API');
    });
    it('passes CRON', () => {
      expect(mapTriggerType('CRON')).toBe('CRON');
    });
    it('defaults to MANUAL', () => {
      expect(mapTriggerType('MANUAL')).toBe('MANUAL');
    });
    it('defaults to MANUAL for undefined', () => {
      expect(mapTriggerType(undefined)).toBe('MANUAL');
    });
    it('defaults to MANUAL for unknown', () => {
      expect(mapTriggerType('UNKNOWN')).toBe('MANUAL');
    });
  });

  describe('formatLogsToRecord', () => {
    it('returns empty object for empty array', () => {
      expect(formatLogsToRecord([])).toEqual({});
    });
    it('keys logs by id', () => {
      const logs = [{ id: 'l1', timestamp: 123, type: 'info' as const, message: 'hi' }];
      const result = formatLogsToRecord(logs);
      expect(result['l1']).toMatchObject({ id: 'l1', timestamp: 123, order: 0 });
    });
    it('generates key when id is missing', () => {
      const logs = [{ id: '', timestamp: 456, type: 'info' as const, message: 'hi' }];
      const result = formatLogsToRecord(logs);
      expect(result['log_0']).toBeDefined();
    });
    it('parses timestamp string', () => {
      const logs = [{ id: 'l1', timestamp: '789' as unknown as number, type: 'info' as const, message: 'hi' }];
      const result = formatLogsToRecord(logs);
      expect(result['l1'].timestamp).toBe(789);
    });
    it('parses date string timestamp', () => {
      const logs = [{ id: 'l1', timestamp: '2024-01-01' as unknown as number, type: 'info' as const, message: 'hi' }];
      const result = formatLogsToRecord(logs);
      expect(result['l1'].timestamp).toBeGreaterThan(0);
    });
    it('preserves existing order', () => {
      const logs = [{ id: 'l1', timestamp: 123, type: 'info' as const, message: 'hi', order: 5 }];
      const result = formatLogsToRecord(logs);
      expect(result['l1'].order).toBe(5);
    });
  });
});

describe('utils — extra coverage', () => {
  it('formatLogsToRecord: handles Date string timestamp', () => {
    const logs = [
      { id: 'l1', timestamp: '2024-06-15T12:00:00Z' as unknown as number, type: 'info' as const, message: 'x' },
    ];
    const result = formatLogsToRecord(logs);
    expect(result['l1'].timestamp).toBeGreaterThan(0);
  });

  it('formatLogsToRecord: falls back to Date.now() for unparseable', () => {
    const before = Date.now();
    const logs = [
      { id: 'l1', timestamp: 'not-a-date' as unknown as number, type: 'info' as const, message: 'x' },
    ];
    const result = formatLogsToRecord(logs);
    expect(result['l1'].timestamp).toBeGreaterThanOrEqual(before);
  });

  it('formatLogsToRecord: preserves multiple logs with order', () => {
    const logs = [
      { id: 'a', timestamp: 1, type: 'info' as const, message: 'first' },
      { id: 'b', timestamp: 2, type: 'info' as const, message: 'second' },
      { id: 'c', timestamp: 3, type: 'info' as const, message: 'third' },
    ];
    const result = formatLogsToRecord(logs);
    expect(result['a'].order).toBe(0);
    expect(result['b'].order).toBe(1);
    expect(result['c'].order).toBe(2);
  });
});
