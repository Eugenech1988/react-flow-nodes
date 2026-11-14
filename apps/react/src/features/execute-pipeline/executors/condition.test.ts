import { describe, it, expect } from 'vitest';
import { executeConditionNode } from './condition';
import type { TPipelineNode } from '@/entities';

const makeNode = (data: Record<string, unknown>): TPipelineNode =>
  ({ id: 'n1', type: 'conditional', position: { x: 0, y: 0 }, data }) as unknown as TPipelineNode;

describe('executeConditionNode', () => {
  it('compares equal values', async () => {
    const node = makeNode({ value: 'a', compareWith: 'a', operator: '==' });
    expect((await executeConditionNode(node, {})).matched).toBe(true);
  });
  it('compares unequal values', async () => {
    const node = makeNode({ value: 'a', compareWith: 'b', operator: '==' });
    expect((await executeConditionNode(node, {})).matched).toBe(false);
  });
  it('compares !==', async () => {
    const node = makeNode({ value: 'a', compareWith: 'b', operator: '!=' });
    expect((await executeConditionNode(node, {})).matched).toBe(true);
  });
  it('compares greater than', async () => {
    const node = makeNode({ value: '10', compareWith: '5', operator: '>' });
    expect((await executeConditionNode(node, {})).matched).toBe(true);
  });
  it('compares less than', async () => {
    const node = makeNode({ value: '3', compareWith: '5', operator: '<' });
    expect((await executeConditionNode(node, {})).matched).toBe(true);
  });
  it('throws for non-numeric > comparison', async () => {
    const node = makeNode({ value: 'abc', compareWith: '5', operator: '>' });
    expect(() => executeConditionNode(node, {})).toThrow('requires numeric values');
  });
  it('throws for non-numeric < comparison', async () => {
    const node = makeNode({ value: '3', compareWith: 'xyz', operator: '<' });
    expect(() => executeConditionNode(node, {})).toThrow('requires numeric values');
  });
  it('uses connectedValue', async () => {
    const node = makeNode({ compareWith: '5', operator: '>' });
    const result = await executeConditionNode(node, { connectedValue: '10' });
    expect(result.matched).toBe(true);
  });
  it('uses connectedCompareWith', async () => {
    const node = makeNode({ value: '10', operator: '>' });
    const result = await executeConditionNode(node, { connectedCompareWith: '5' });
    expect(result.matched).toBe(true);
  });
  it('defaults to == operator', async () => {
    const node = makeNode({ value: 'same', compareWith: 'same' });
    expect((await executeConditionNode(node, {})).matched).toBe(true);
  });
});

describe('executeConditionNode — extra coverage', () => {
  it('uses input.text when data.value missing', async () => {
    const node = makeNode({ compareWith: 'hello', operator: '==' });
    const result = await executeConditionNode(node, { text: 'hello' });
    expect(result.matched).toBe(true);
  });

  it('uses input.result as fallback', async () => {
    const node = makeNode({ compareWith: '42', operator: '==' });
    const result = await executeConditionNode(node, { result: '42' });
    expect(result.matched).toBe(true);
  });

  it('uses input.value fallback', async () => {
    const node = makeNode({ compareWith: 'test', operator: '==' });
    const result = await executeConditionNode(node, { value: 'test' });
    expect(result.matched).toBe(true);
  });

  it('compares both empty as equal', async () => {
    const node = makeNode({ operator: '==' });
    const result = await executeConditionNode(node, {});
    expect(result.matched).toBe(true);
  });
});
