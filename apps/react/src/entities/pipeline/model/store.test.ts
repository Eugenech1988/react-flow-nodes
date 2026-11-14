import { describe, it, expect } from 'vitest';
import { useStore } from './store';

describe('pipeline store', () => {
  it('exposes graph and execution slices', () => {
    const state = useStore.getState();
    expect(typeof state.addNode).toBe('function');
    expect(typeof state.runWorkflow).toBe('function');
    expect(state.nodes).toEqual([]);
    expect(state.logs).toEqual([]);
  });

  it('persist partialize returns only nodes and edges', () => {
    const options = useStore.persist.getOptions();
    expect(options.partialize).toBeDefined();

    const partialized = options.partialize!(useStore.getState()) as Record<string, unknown>;
    const keys = Object.keys(partialized);

    expect(keys).toContain('nodes');
    expect(keys).toContain('edges');
    expect(keys).toHaveLength(2);
  });

  it('does not persist logs, history, or transient UI state', () => {
    const options = useStore.persist.getOptions();
    const partialized = options.partialize!(useStore.getState()) as Record<string, unknown>;

    expect(partialized).not.toHaveProperty('logs');
    expect(partialized).not.toHaveProperty('past');
    expect(partialized).not.toHaveProperty('future');
    expect(partialized).not.toHaveProperty('saveStatus');
    expect(partialized).not.toHaveProperty('clipboard');
  });
});
