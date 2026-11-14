import { describe, expect, it } from 'vitest';
import type { TPipelineEdge, TPipelineNode } from '@/entities';
import { getConnectedValue, mapOutputToTarget } from './targetMapping';

const makeEdge = (overrides: Partial<TPipelineEdge> = {}): TPipelineEdge =>
  ({ id: 'e1', source: 'src', target: 'tgt', ...overrides }) as TPipelineEdge;

const makeNode = (nodeType: string, type = 'custom'): TPipelineNode =>
  ({
    id: 'tgt',
    type,
    position: { x: 0, y: 0 },
    data: { nodeType },
  }) as TPipelineNode;

describe('getConnectedValue', () => {
  it('prefers named sourceHandle value', () => {
    expect(getConnectedValue({ output: 'named', value: 'default' }, 'output')).toBe('named');
  });

  it('falls back to value', () => {
    expect(getConnectedValue({ value: 'v' })).toBe('v');
  });

  it('falls back to text', () => {
    expect(getConnectedValue({ text: 't' })).toBe('t');
  });

  it('falls back to imageUrl', () => {
    expect(getConnectedValue({ imageUrl: 'http://img' })).toBe('http://img');
  });

  it('returns whole object when no terminal key', () => {
    const output = { customField: 'x' };
    expect(getConnectedValue(output)).toBe(output);
  });
});

describe('mapOutputToTarget — math', () => {
  it('maps a → connectedLeftOperand', () => {
    expect(
      mapOutputToTarget({ value: 10 }, makeEdge({ targetHandle: 'a' }), makeNode('math')),
    ).toEqual({
      connectedLeftOperand: 10,
    });
  });

  it('maps b → connectedRightOperand', () => {
    expect(
      mapOutputToTarget({ value: 20 }, makeEdge({ targetHandle: 'b' }), makeNode('math')),
    ).toEqual({
      connectedRightOperand: 20,
    });
  });
});

describe('mapOutputToTarget — condition', () => {
  it('maps value → connectedValue', () => {
    expect(
      mapOutputToTarget({ value: 'x' }, makeEdge({ targetHandle: 'value' }), makeNode('condition')),
    ).toEqual({ connectedValue: 'x' });
  });

  it('maps compare → connectedCompareWith', () => {
    expect(
      mapOutputToTarget(
        { value: 'y' },
        makeEdge({ targetHandle: 'compare' }),
        makeNode('condition'),
      ),
    ).toEqual({ connectedCompareWith: 'y' });
  });
});

describe('mapOutputToTarget — llm', () => {
  it('maps system → connectedSystemPrompt', () => {
    expect(
      mapOutputToTarget({ text: 'sys' }, makeEdge({ targetHandle: 'system' }), makeNode('llm')),
    ).toEqual({ connectedSystemPrompt: 'sys' });
  });

  it('maps prompt → connectedPrompt', () => {
    expect(
      mapOutputToTarget({ text: 'p' }, makeEdge({ targetHandle: 'prompt' }), makeNode('llm')),
    ).toEqual({ connectedPrompt: 'p' });
  });
});

describe('mapOutputToTarget — image', () => {
  it('maps image → connectedImageUrl', () => {
    expect(
      mapOutputToTarget(
        { imageUrl: 'http://img' },
        makeEdge({ targetHandle: 'image' }),
        makeNode('image'),
      ),
    ).toEqual({ connectedImageUrl: 'http://img' });
  });
});

describe('mapOutputToTarget — api', () => {
  it('maps input → body', () => {
    expect(
      mapOutputToTarget({ value: 'body' }, makeEdge({ targetHandle: 'input' }), makeNode('api')),
    ).toEqual({ body: 'body' });
  });
});

describe('mapOutputToTarget — output', () => {
  it('maps output handle → value', () => {
    expect(
      mapOutputToTarget(
        { value: 'result' },
        makeEdge({ targetHandle: 'value' }),
        makeNode('output'),
      ),
    ).toEqual({ value: 'result' });
  });
});

describe('mapOutputToTarget — var-*', () => {
  it('maps var-name → { name: value }', () => {
    expect(
      mapOutputToTarget(
        { value: 'v' },
        makeEdge({ targetHandle: 'var-inputVar' }),
        makeNode('text', 'text'),
      ),
    ).toEqual({ inputVar: 'v' });
  });

  it('returns {} for empty var- handle', () => {
    expect(
      mapOutputToTarget(
        { value: 'v' },
        makeEdge({ targetHandle: 'var-' }),
        makeNode('text', 'text'),
      ),
    ).toEqual({});
  });
});

describe('mapOutputToTarget — unknown', () => {
  it('returns {} for unknown node type', () => {
    expect(
      mapOutputToTarget(
        { value: 'x' },
        makeEdge({ targetHandle: 'anything' }),
        makeNode('unknown'),
      ),
    ).toEqual({});
  });

  it('returns {} for unknown handle on known node', () => {
    expect(
      mapOutputToTarget({ value: 1 }, makeEdge({ targetHandle: 'c' }), makeNode('math')),
    ).toEqual({});
  });
});
