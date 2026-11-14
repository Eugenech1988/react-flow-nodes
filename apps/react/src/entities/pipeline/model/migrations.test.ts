import { describe, expect, it } from 'vitest';
import { migratePersistedState, PERSISTED_STATE_VERSION } from './migrations';

describe('migratePersistedState', () => {
  it('exports PERSISTED_STATE_VERSION = 2', () => {
    expect(PERSISTED_STATE_VERSION).toBe(2);
  });

  describe('migrate v0 → v1', () => {
    it('accepts valid { nodes, edges }', () => {
      const input = { nodes: [{ id: 'n1' }], edges: [{ id: 'e1' }] };
      const out = migratePersistedState(input, 0);
      expect(out.nodes).toHaveLength(1);
      expect(out.edges).toHaveLength(1);
    });

    it('returns empty arrays for null', () => {
      expect(migratePersistedState(null, 0)).toEqual({ nodes: [], edges: [] });
    });

    it('returns empty arrays for undefined', () => {
      expect(migratePersistedState(undefined, 0)).toEqual({ nodes: [], edges: [] });
    });

    it('returns empty arrays for non-object primitives', () => {
      expect(migratePersistedState('string', 0)).toEqual({ nodes: [], edges: [] });
      expect(migratePersistedState(42, 0)).toEqual({ nodes: [], edges: [] });
      expect(migratePersistedState(true, 0)).toEqual({ nodes: [], edges: [] });
    });

    it('defaults nodes to [] when not array', () => {
      const out = migratePersistedState({ nodes: 'broken', edges: [] }, 0);
      expect(out.nodes).toEqual([]);
      expect(out.edges).toEqual([]);
    });

    it('defaults edges to [] when not array', () => {
      const out = migratePersistedState({ nodes: [], edges: 'broken' }, 0);
      expect(out.nodes).toEqual([]);
      expect(out.edges).toEqual([]);
    });

    it('preserves nodes and edges as-is', () => {
      const nodes = [{ id: 'n1', type: 'text', position: { x: 0, y: 0 }, data: {} }];
      const edges = [{ id: 'e1', source: 'n1', target: 'n1' }];
      const out = migratePersistedState({ nodes, edges }, 0);
      expect(out.nodes).toEqual(nodes);
      expect(out.edges).toEqual(edges);
    });

    it('drops unknown keys', () => {
      const out = migratePersistedState(
        { nodes: [], edges: [], logs: [{ msg: 'x' }], past: [], extra: 42 },
        0,
      );
      expect(Object.keys(out).sort()).toEqual(['edges', 'nodes']);
    });
  });

  describe('current version passthrough', () => {
    it('passes through at current version', () => {
      const out = migratePersistedState(
        { nodes: [{ id: 'n1' }], edges: [] },
        PERSISTED_STATE_VERSION,
      );
      expect(out.nodes).toHaveLength(1);
    });

    it('handles future version gracefully', () => {
      expect(migratePersistedState({ nodes: [], edges: [] }, 999)).toEqual({
        nodes: [],
        edges: [],
      });
    });

    it('still normalizes shape at current version', () => {
      const out = migratePersistedState({ nodes: 'broken', edges: 'broken' }, 1);
      expect(out).toEqual({ nodes: [], edges: [] });
    });
  });
});

describe('migrate v1 to v2', () => {
  const makeNode = (data: Record<string, unknown>) => ({
    id: 'n1',
    type: 'customInput',
    position: { x: 0, y: 0 },
    data,
  });

  it('PERSISTED_STATE_VERSION is 2', () => {
    expect(PERSISTED_STATE_VERSION).toBe(2);
  });

  it('converts "true" to boolean true', () => {
    const out = migratePersistedState(
      { nodes: [makeNode({ continueOnError: 'true' })], edges: [] },
      1,
    );
    expect((out.nodes[0].data as { continueOnError: boolean }).continueOnError).toBe(true);
  });

  it('converts "false" to boolean false', () => {
    const out = migratePersistedState(
      { nodes: [makeNode({ continueOnError: 'false' })], edges: [] },
      1,
    );
    expect((out.nodes[0].data as { continueOnError: boolean }).continueOnError).toBe(false);
  });

  it('converts "TRUE" case-insensitively', () => {
    const out = migratePersistedState(
      { nodes: [makeNode({ continueOnError: 'TRUE' })], edges: [] },
      1,
    );
    expect((out.nodes[0].data as { continueOnError: boolean }).continueOnError).toBe(true);
  });

  it('converts number 1 to true, 0 to false', () => {
    const out1 = migratePersistedState({ nodes: [makeNode({ continueOnError: 1 })], edges: [] }, 1);
    expect((out1.nodes[0].data as { continueOnError: boolean }).continueOnError).toBe(true);

    const out0 = migratePersistedState({ nodes: [makeNode({ continueOnError: 0 })], edges: [] }, 1);
    expect((out0.nodes[0].data as { continueOnError: boolean }).continueOnError).toBe(false);
  });

  it('leaves boolean as-is', () => {
    const out = migratePersistedState(
      { nodes: [makeNode({ continueOnError: true })], edges: [] },
      1,
    );
    expect((out.nodes[0].data as { continueOnError: boolean }).continueOnError).toBe(true);
  });

  it('removes unparseable strings', () => {
    const out = migratePersistedState(
      { nodes: [makeNode({ continueOnError: 'yes' })], edges: [] },
      1,
    );
    expect(out.nodes[0].data).not.toHaveProperty('continueOnError');
  });

  it('leaves undefined as-is', () => {
    const out = migratePersistedState({ nodes: [makeNode({})], edges: [] }, 1);
    expect(out.nodes[0].data).not.toHaveProperty('continueOnError');
  });

  it('preserves other node data', () => {
    const out = migratePersistedState(
      { nodes: [makeNode({ inputName: 'x', continueOnError: 'true' })], edges: [] },
      1,
    );
    expect((out.nodes[0].data as { inputName: string }).inputName).toBe('x');
  });

  it('handles empty nodes', () => {
    const out = migratePersistedState({ nodes: [], edges: [] }, 1);
    expect(out.nodes).toEqual([]);
  });
});
