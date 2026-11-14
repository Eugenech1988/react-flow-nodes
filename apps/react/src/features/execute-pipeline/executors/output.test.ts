import { describe, it, expect } from 'vitest';
import { executeOutputNode } from './output';
import type { TPipelineNode } from '@/entities';

const makeNode = (data: Record<string, unknown>): TPipelineNode =>
  ({ id: 'n1', type: 'customOutput', position: { x: 0, y: 0 }, data }) as unknown as TPipelineNode;

describe('executeOutputNode', () => {
  describe('text output (default)', () => {
    it('uses outputName as key', async () => {
      const node = makeNode({ outputName: 'myOutput' });
      const result = await executeOutputNode(node, { value: 'hello' });
      expect(result.myOutput).toBe('hello');
      expect(result.output).toBe('hello');
    });

    it('defaults to "output" key when outputName missing', async () => {
      const node = makeNode({});
      const result = await executeOutputNode(node, { value: 'x' });
      expect(result.output).toBe('x');
    });

    it('extracts value first', async () => {
      const node = makeNode({ outputName: 'o' });
      const result = await executeOutputNode(node, { value: 'v', result: 'r', text: 't' });
      expect(result.o).toBe('v');
    });

    it('falls back to result', async () => {
      const node = makeNode({ outputName: 'o' });
      const result = await executeOutputNode(node, { result: 'r', text: 't' });
      expect(result.o).toBe('r');
    });

    it('falls back to text', async () => {
      const node = makeNode({ outputName: 'o' });
      const result = await executeOutputNode(node, { text: 't', response: 'resp' });
      expect(result.o).toBe('t');
    });

    it('falls back to response', async () => {
      const node = makeNode({ outputName: 'o' });
      const result = await executeOutputNode(node, { response: 'resp', rows: ['r'] });
      expect(result.o).toBe('resp');
    });

    it('falls back to rows', async () => {
      const node = makeNode({ outputName: 'o' });
      const result = await executeOutputNode(node, { rows: [1, 2], inputValue: 'i' });
      expect(result.o).toEqual([1, 2]);
    });

    it('falls back to inputValue', async () => {
      const node = makeNode({ outputName: 'o' });
      const result = await executeOutputNode(node, { inputValue: 'iv' });
      expect(result.o).toBe('iv');
    });

    it('falls back to full input object when nothing matches', async () => {
      const node = makeNode({ outputName: 'o' });
      const input = { customField: 'x' };
      const result = await executeOutputNode(node, input);
      expect(result.o).toEqual(input);
    });
  });

  describe('image output', () => {
    it('extracts imageUrl first', async () => {
      const node = makeNode({ outputName: 'img', outputType: 'image' });
      const result = await executeOutputNode(node, {
        imageUrl: 'http://img',
        processed: 'http://processed',
        value: 'http://value',
      });
      expect(result.img).toBe('http://img');
    });

    it('falls back to processed', async () => {
      const node = makeNode({ outputName: 'img', outputType: 'image' });
      const result = await executeOutputNode(node, {
        processed: 'http://processed',
        value: 'http://value',
      });
      expect(result.img).toBe('http://processed');
    });

    it('falls back to value', async () => {
      const node = makeNode({ outputName: 'img', outputType: 'image' });
      const result = await executeOutputNode(node, { value: 'http://value' });
      expect(result.img).toBe('http://value');
    });

    it('returns empty string when no image source', async () => {
      const node = makeNode({ outputName: 'img', outputType: 'image' });
      const result = await executeOutputNode(node, {});
      expect(result.img).toBe('');
    });
  });

  describe('propagation', () => {
    it('preserves input fields in result', async () => {
      const node = makeNode({ outputName: 'o' });
      const result = await executeOutputNode(node, { value: 'x', extra: 'y' });
      expect(result.extra).toBe('y');
    });

    it('always sets "output" key alongside custom outputName', async () => {
      const node = makeNode({ outputName: 'result' });
      const result = await executeOutputNode(node, { value: 'z' });
      expect(result.result).toBe('z');
      expect(result.output).toBe('z');
    });
  });
});
