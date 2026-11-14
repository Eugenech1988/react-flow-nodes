import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeNode } from './executeNode';
import type { TPipelineNode } from '@/entities';

const { mockExecutors } = vi.hoisted(() => ({
  mockExecutors: {
    input: vi.fn(),
    output: vi.fn(),
    text: vi.fn(),
    image: vi.fn(),
    llm: vi.fn(),
    math: vi.fn(),
    condition: vi.fn(),
    api: vi.fn(),
    database: vi.fn(),
  },
}));

vi.mock('./executors', () => ({
  executeInputNode: mockExecutors.input,
  executeOutputNode: mockExecutors.output,
  executeTextNode: mockExecutors.text,
  executeMathNode: mockExecutors.math,
  executeConditionNode: mockExecutors.condition,
  executeApiNode: mockExecutors.api,
  executeDatabaseNode: mockExecutors.database,
  executeLlmNode: mockExecutors.llm,
  executeImageNode: mockExecutors.image,
}));

const makeNode = (type: string, nodeType?: string): TPipelineNode =>
  ({ id: 'n1', type, position: { x: 0, y: 0 }, data: { nodeType } }) as unknown as TPipelineNode;

describe('executeNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(mockExecutors).forEach((fn) => fn.mockResolvedValue({ ok: true }));
  });

  describe('exact matches', () => {
    it('dispatches input', async () => {
      await executeNode(makeNode('input', 'input'), {}, 'p1');
      expect(mockExecutors.input).toHaveBeenCalled();
    });
    it('dispatches output', async () => {
      await executeNode(makeNode('output', 'output'), {}, 'p1');
      expect(mockExecutors.output).toHaveBeenCalled();
    });
    it('dispatches text', async () => {
      await executeNode(makeNode('text', 'text'), {}, 'p1');
      expect(mockExecutors.text).toHaveBeenCalled();
    });
    it('dispatches math', async () => {
      await executeNode(makeNode('math', 'math'), {}, 'p1');
      expect(mockExecutors.math).toHaveBeenCalled();
    });
    it('dispatches condition', async () => {
      await executeNode(makeNode('condition', 'condition'), {}, 'p1');
      expect(mockExecutors.condition).toHaveBeenCalled();
    });
    it('dispatches api', async () => {
      await executeNode(makeNode('api', 'api'), {}, 'p1');
      expect(mockExecutors.api).toHaveBeenCalled();
    });
    it('dispatches llm', async () => {
      await executeNode(makeNode('llm', 'llm'), {}, 'p1');
      expect(mockExecutors.llm).toHaveBeenCalled();
    });
    it('dispatches image', async () => {
      await executeNode(makeNode('image', 'image'), {}, 'p1');
      expect(mockExecutors.image).toHaveBeenCalled();
    });
    it('dispatches database', async () => {
      await executeNode(makeNode('database', 'database'), {}, 'p1');
      expect(mockExecutors.database).toHaveBeenCalled();
    });
    it('dispatches db as database', async () => {
      await executeNode(makeNode('db', 'db'), {}, 'p1');
      expect(mockExecutors.database).toHaveBeenCalled();
    });
  });

  describe('aliases', () => {
    it('maps custominput → input', async () => {
      await executeNode(makeNode('customInput', 'customInput'), {}, 'p1');
      expect(mockExecutors.input).toHaveBeenCalled();
    });
    it('maps customoutput → output', async () => {
      await executeNode(makeNode('customOutput', 'customOutput'), {}, 'p1');
      expect(mockExecutors.output).toHaveBeenCalled();
    });
    it('maps conditional → condition', async () => {
      await executeNode(makeNode('conditional', 'conditional'), {}, 'p1');
      expect(mockExecutors.condition).toHaveBeenCalled();
    });
    it('maps media → image', async () => {
      await executeNode(makeNode('media', 'media'), {}, 'p1');
      expect(mockExecutors.image).toHaveBeenCalled();
    });
  });

  describe('fallback (includes)', () => {
    it('matches llm in custom type', async () => {
      await executeNode(makeNode('custom-llm-node', 'my-llm'), {}, 'p1');
      expect(mockExecutors.llm).toHaveBeenCalled();
    });
    it('longest match first: database before db', async () => {
      await executeNode(makeNode('my-database-node', 'database-thing'), {}, 'p1');
      expect(mockExecutors.database).toHaveBeenCalled();
    });
  });

  describe('unknown node', () => {
    it('throws for unknown type', async () => {
      await expect(executeNode(makeNode('unknown-type'), {})).rejects.toThrow(
        'No executor registered'
      );
    });
  });

  describe('context propagation', () => {
    it('passes pipelineId to executor', async () => {
      await executeNode(makeNode('text', 'text'), {}, 'pipeline-42');
      expect(mockExecutors.text).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        { pipelineId: 'pipeline-42' }
      );
    });
  });
});
