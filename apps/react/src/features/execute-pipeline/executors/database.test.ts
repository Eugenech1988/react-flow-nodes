import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeDatabaseNode } from './database';
import type { TPipelineNode } from '@/entities';

const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));

vi.mock('@/shared/api', () => ({
  trpcClient: {
    databaseNodes: {
      createRecord: { mutate: mockMutate },
    },
  },
}));

const makeNode = (data: Record<string, unknown>): TPipelineNode =>
  ({ id: 'node-1', type: 'database', position: { x: 0, y: 0 }, data }) as unknown as TPipelineNode;

describe('executeDatabaseNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends query with resolved templates', async () => {
    mockMutate.mockResolvedValue({ data: null });
    const node = makeNode({ query: 'SELECT * FROM users WHERE id = {{id}}' });
    await executeDatabaseNode(node, { id: 42 }, { pipelineId: 'p1' });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        nodeId: 'node-1',
        pipelineId: 'p1',
        query: 'SELECT * FROM users WHERE id = 42',
      })
    );
  });

  it('defaults to SELECT query', async () => {
    mockMutate.mockResolvedValue({ data: [] });
    const node = makeNode({});
    await executeDatabaseNode(node, {}, {});

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'SELECT * FROM table' })
    );
  });

  it('normalizes array response', async () => {
    mockMutate.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });
    const node = makeNode({ query: 'SELECT' });
    const result = await executeDatabaseNode(node, {}, { pipelineId: null });

    expect(result.rows).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('normalizes object with result array', async () => {
    mockMutate.mockResolvedValue({ data: { result: [{ a: 1 }] } });
    const node = makeNode({ query: 'SELECT' });
    const result = await executeDatabaseNode(node, {}, { pipelineId: null });

    expect(result.rows).toEqual([{ a: 1 }]);
  });

  it('normalizes object with single result', async () => {
    mockMutate.mockResolvedValue({ data: { result: { a: 1 } } });
    const node = makeNode({ query: 'SELECT' });
    const result = await executeDatabaseNode(node, {}, { pipelineId: null });

    expect(result.rows).toEqual([{ a: 1 }]);
  });

  it('wraps object without result key', async () => {
    mockMutate.mockResolvedValue({ data: { a: 1 } });
    const node = makeNode({ query: 'SELECT' });
    const result = await executeDatabaseNode(node, {}, { pipelineId: null });

    expect(result.rows).toEqual([{ a: 1 }]);
  });

  it('wraps primitive response', async () => {
    mockMutate.mockResolvedValue({ data: 42 });
    const node = makeNode({ query: 'SELECT' });
    const result = await executeDatabaseNode(node, {}, { pipelineId: null });

    expect(result.rows).toEqual([42]);
  });

  it('handles null response as empty rows', async () => {
    mockMutate.mockResolvedValue({ data: null });
    const node = makeNode({ query: 'SELECT' });
    const result = await executeDatabaseNode(node, {}, { pipelineId: null });

    expect(result.rows).toEqual([]);
  });

  it('wraps mutation errors', async () => {
    mockMutate.mockRejectedValue(new Error('DB connection lost'));
    const node = makeNode({ query: 'SELECT' });
    await expect(executeDatabaseNode(node, {}, {})).rejects.toThrow(
      'Database node execution failed: DB connection lost'
    );
  });
});

describe('executeDatabaseNode — extra coverage', () => {
  it('uses data.pipelineId when context missing', async () => {
    mockMutate.mockResolvedValue({ data: [] });
    const node = makeNode({ query: 'SELECT', pipelineId: 'from-data' });
    await executeDatabaseNode(node, {}, {});

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ pipelineId: 'from-data' })
    );
  });

  it('uses input.pipelineId when context and data missing', async () => {
    mockMutate.mockResolvedValue({ data: [] });
    const node = makeNode({ query: 'SELECT' });
    await executeDatabaseNode(node, { pipelineId: 'from-input' }, {});

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ pipelineId: 'from-input' })
    );
  });

  it('falls back to null pipelineId', async () => {
    mockMutate.mockResolvedValue({ data: [] });
    const node = makeNode({ query: 'SELECT' });
    await executeDatabaseNode(node, {}, {});

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ pipelineId: null })
    );
  });

  it('prefers context.pipelineId over data', async () => {
    mockMutate.mockResolvedValue({ data: [] });
    const node = makeNode({ query: 'SELECT', pipelineId: 'from-data' });
    await executeDatabaseNode(node, {}, { pipelineId: 'from-context' });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ pipelineId: 'from-context' })
    );
  });

  it('wraps non-Error throws', async () => {
    mockMutate.mockRejectedValue('string-error');
    const node = makeNode({ query: 'SELECT' });

    await expect(executeDatabaseNode(node, {}, {})).rejects.toThrow(
      'Database node execution failed: string-error'
    );
  });
});
