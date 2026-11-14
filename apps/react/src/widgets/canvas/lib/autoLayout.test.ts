import { describe, expect, it } from 'vitest';
import type { Edge } from '@xyflow/react';
import type { TPipelineNode } from '@/entities';
import { computeAutoLayout } from './autoLayout';

const makeNode = (id: string, width = 100, height = 50): TPipelineNode =>
  ({
    id,
    type: 'text',
    position: { x: 0, y: 0 },
    measured: { width, height },
    data: {},
  }) as TPipelineNode;

const makeEdge = (id: string, source: string, target: string): Edge =>
  ({ id, source, target }) as Edge;

describe('computeAutoLayout', () => {
  it('returns empty array for empty nodes', () => {
    expect(computeAutoLayout([], [])).toEqual([]);
  });

  it('returns same length for single node', () => {
    const nodes = [makeNode('a')];
    const result = computeAutoLayout(nodes, []);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a');
  });

  it('positions connected nodes horizontally (LR default)', () => {
    const nodes = [makeNode('a'), makeNode('b')];
    const edges = [makeEdge('e1', 'a', 'b')];
    const result = computeAutoLayout(nodes, edges);

    const a = result.find((n) => n.id === 'a')!;
    const b = result.find((n) => n.id === 'b')!;
    expect(b.position.x).toBeGreaterThan(a.position.x);
  });

  it('respects TB direction', () => {
    const nodes = [makeNode('a'), makeNode('b')];
    const edges = [makeEdge('e1', 'a', 'b')];
    const result = computeAutoLayout(nodes, edges, 'TB');

    const a = result.find((n) => n.id === 'a')!;
    const b = result.find((n) => n.id === 'b')!;
    expect(b.position.y).toBeGreaterThan(a.position.y);
  });

  it('uses default dimensions when measured is missing', () => {
    const nodes = [
      { id: 'a', type: 'text', position: { x: 0, y: 0 }, data: {} } as TPipelineNode,
      { id: 'b', type: 'text', position: { x: 0, y: 0 }, data: {} } as TPipelineNode,
    ];
    const result = computeAutoLayout(nodes, [makeEdge('e1', 'a', 'b')]);

    expect(result).toHaveLength(2);
    expect(result[0].position).toBeDefined();
    expect(result[1].position).toBeDefined();
  });

  it('preserves node data and type', () => {
    const nodes = [
      { ...makeNode('a'), data: { label: 'A', extra: 42 } },
      makeNode('b'),
    ];
    const result = computeAutoLayout(nodes, [makeEdge('e1', 'a', 'b')]);

    const a = result.find((n) => n.id === 'a')!;
    expect(a.data).toEqual({ label: 'A', extra: 42 });
    expect(a.type).toBe('text');
  });
});
