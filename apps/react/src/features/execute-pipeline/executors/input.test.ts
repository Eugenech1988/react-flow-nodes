import { describe, it, expect } from 'vitest';
import { executeInputNode } from './input';
import type { TPipelineNode } from '@/entities';

const makeNode = (data: Record<string, unknown>): TPipelineNode =>
  ({ id: 'n1', type: 'customInput', position: { x: 0, y: 0 }, data }) as unknown as TPipelineNode;

describe('executeInputNode', () => {
  it('uses inputName as key', async () => {
    const node = makeNode({ inputName: 'myField', inputValue: 'hello' });
    const result = await executeInputNode(node, {});
    expect(result.myField).toBe('hello');
    expect(result.value).toBe('hello');
  });
  it('defaults to "input" when inputName missing', async () => {
    const node = makeNode({ inputValue: 'x' });
    const result = await executeInputNode(node, {});
    expect(result.input).toBe('x');
    expect(result.value).toBe('x');
  });
  it('defaults to empty string when inputValue missing', async () => {
    const node = makeNode({ inputName: 'f' });
    const result = await executeInputNode(node, {});
    expect(result.f).toBe('');
  });
});
