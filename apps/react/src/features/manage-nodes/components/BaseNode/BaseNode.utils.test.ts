import { describe, it, expect, } from 'vitest';
import { Position } from '@xyflow/react';
import type { TFieldConfig, THandleConfig } from '@/entities';
import {
  sideOf,
  withEvenSpacing,
  withAutoPositions,
  buildInitialValues,
  toVariableHandle,
} from './BaseNode.utils';

describe('BaseNode.utils', () => {
  describe('sideOf', () => {
    it('returns "left" for target handle (default)', () => {
      expect(sideOf({ id: 'in', type: 'target' })).toBe('left');
    });

    it('returns "right" for source handle (default)', () => {
      expect(sideOf({ id: 'out', type: 'source' })).toBe('right');
    });

    it('respects explicit position Left', () => {
      expect(sideOf({ id: 'x', type: 'source', position: Position.Left })).toBe('left');
    });

    it('respects explicit position Right', () => {
      expect(sideOf({ id: 'x', type: 'target', position: Position.Right })).toBe('right');
    });
  });

  describe('withEvenSpacing', () => {
    it('assigns top percentage to each handle', () => {
      const handles: THandleConfig[] = [
        { id: 'a', type: 'target' },
        { id: 'b', type: 'target' },
        { id: 'c', type: 'target' },
      ];
      const result = withEvenSpacing(handles);

      expect(result[0].style).toEqual({ top: '25%' });
      expect(result[1].style).toEqual({ top: '50%' });
      expect(result[2].style).toEqual({ top: '75%' });
    });

    it('does not override existing style', () => {
      const handles: THandleConfig[] = [{ id: 'a', type: 'target', style: { top: '10px' } }];
      const result = withEvenSpacing(handles);
      expect(result[0].style).toEqual({ top: '10px' });
    });

    it('returns empty array for empty input', () => {
      expect(withEvenSpacing([])).toEqual([]);
    });
  });

  describe('withAutoPositions', () => {
    it('splits handles by side and spaces them', () => {
      const handles: THandleConfig[] = [
        { id: 't1', type: 'target' },
        { id: 't2', type: 'target' },
        { id: 's1', type: 'source' },
      ];

      const result = withAutoPositions(handles);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('t1');
      expect(result[0].style?.top).toMatch(/^33\./);
      expect(result[1].id).toBe('t2');
      expect(result[1].style?.top).toMatch(/^66\./);
      expect(result[2].id).toBe('s1');
      expect(result[2].style?.top).toBe('50%');
    });
  });

  describe('buildInitialValues', () => {
    it('uses data value when present', () => {
      const fields: TFieldConfig[] = [{ key: 'name', label: 'Name' }];
      const result = buildInitialValues(fields, { name: 'Bob' }, 'id-1');
      expect(result.name).toBe('Bob');
    });

    it('uses static defaultValue when data missing', () => {
      const fields: TFieldConfig[] = [{ key: 'op', label: 'Op', defaultValue: 'add' }];
      const result = buildInitialValues(fields, {}, 'id-1');
      expect(result.op).toBe('add');
    });

    it('calls defaultValue function with id', () => {
      const fields: TFieldConfig[] = [
        { key: 'label', label: 'Label', defaultValue: (id) => `label-${id}` },
      ];
      const result = buildInitialValues(fields, {}, 'node-42');
      expect(result.label).toBe('label-node-42');
    });

    it('falls back to empty string when nothing provided', () => {
      const fields: TFieldConfig[] = [{ key: 'x', label: 'X' }];
      const result = buildInitialValues(fields, {}, 'id');
      expect(result.x).toBe('');
    });

    it('handles multiple fields', () => {
      const fields: TFieldConfig[] = [
        { key: 'a', label: 'A', defaultValue: 'x' },
        { key: 'b', label: 'B' },
      ];
      const result = buildInitialValues(fields, { b: 'y' }, 'id');
      expect(result.a).toBe('x');
      expect(result.b).toBe('y');
    });
  });

  describe('toVariableHandle', () => {
    it('returns target handle on the left', () => {
      const result = toVariableHandle('myVar');
      expect(result).toEqual({
        id: 'var-myVar',
        type: 'target',
        position: Position.Left,
      });
    });
  });
});
