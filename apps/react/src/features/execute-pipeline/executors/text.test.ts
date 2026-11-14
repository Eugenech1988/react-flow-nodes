import { describe, it, expect } from 'vitest';
import { executeTextNode } from './text';
import type { TPipelineNode } from '@/entities';

const makeNode = (data: Record<string, unknown>): TPipelineNode =>
  ({ id: 'n1', type: 'text', position: { x: 0, y: 0 }, data }) as unknown as TPipelineNode;

describe('executeTextNode', () => {
  it('returns text as-is when no templates', async () => {
    const node = makeNode({ text: 'plain text' });
    const result = await executeTextNode(node, {});
    expect(result.text).toBe('plain text');
  });
  it('resolves templates', async () => {
    const node = makeNode({ text: 'Hello {{name}}' });
    const result = await executeTextNode(node, { name: 'Bob' });
    expect(result.text).toBe('Hello Bob');
  });
  it('defaults to empty string', async () => {
    const node = makeNode({});
    const result = await executeTextNode(node, {});
    expect(result.text).toBe('');
  });
});
