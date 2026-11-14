import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStore } from '../store';
import type { TPipelineNode, TPipelineEdge } from '../../types';

const { mockExecuteNode, mockStartExecution, mockFinishExecution, mockValidatePipeline } =
  vi.hoisted(() => ({
    mockExecuteNode: vi.fn(),
    mockStartExecution: vi.fn(),
    mockFinishExecution: vi.fn(),
    mockValidatePipeline: vi.fn(),
  }));

vi.mock('@/features/execute-pipeline', () => ({
  executeNode: mockExecuteNode,
  pipelineExecutionService: {
    startExecution: mockStartExecution,
    finishExecution: mockFinishExecution,
  },
}));

vi.mock('../lib/validatePipeline', () => ({
  validatePipeline: mockValidatePipeline,
}));

const makeNode = (
  id: string,
  type: string,
  nodeType: string,
  data: Record<string, unknown> = {},
): TPipelineNode =>
  ({
    id,
    type,
    position: { x: 0, y: 0 },
    data: { nodeType, ...data },
  }) as TPipelineNode;

const resetStore = () => {
  useStore.setState({
    nodes: [],
    edges: [],
    pipelineId: null,
    id: null,
    executionStatus: 'idle',
    triggeredBy: 'MANUAL',
    startedAt: null,
    finishedAt: null,
    durationMs: null,
    nodesExecuted: 0,
    activeNodeId: null,
    logs: [],
    successNodeIds: [],
    failedNodeId: null,
  });
};

describe('executionSlice', () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
    mockValidatePipeline.mockReturnValue({ isValid: true, errors: [] });
    mockStartExecution.mockResolvedValue(null);
  });

  describe('addLog', () => {
    it('appends info log by default', () => {
      useStore.getState().addLog('hello');
      const log = useStore.getState().logs[0];

      expect(log.message).toBe('hello');
      expect(log.type).toBe('info');
      expect(log.nodeId).toBeUndefined();
    });

    it('accepts custom type and nodeId', () => {
      useStore.getState().addLog('error', 'error', 'node-1');
      const log = useStore.getState().logs[0];

      expect(log.type).toBe('error');
      expect(log.nodeId).toBe('node-1');
    });
  });

  describe('clearLogs', () => {
    it('empties logs array', () => {
      useStore.getState().addLog('a');
      useStore.getState().clearLogs();
      expect(useStore.getState().logs).toHaveLength(0);
    });
  });

  describe('runNode', () => {
    it('logs error when node not found', async () => {
      await useStore.getState().runNode('missing');

      const logs = useStore.getState().logs;
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe('error');
      expect(logs[0].message).toContain('node was not found');
    });

    it('does nothing when already running', async () => {
      useStore.setState({ executionStatus: 'running' });
      useStore.setState({ nodes: [makeNode('n1', 'text', 'text')] });

      await useStore.getState().runNode('n1');

      expect(mockExecuteNode).not.toHaveBeenCalled();
    });

    it('sets success and logs on executor success', async () => {
      useStore.setState({ nodes: [makeNode('n1', 'text', 'text')] });
      mockExecuteNode.mockResolvedValue({ text: 'result' });

      await useStore.getState().runNode('n1');

      expect(useStore.getState().executionStatus).toBe('success');
      expect(useStore.getState().successNodeIds).toEqual(['n1']);
      expect(useStore.getState().nodesExecuted).toBe(1);
    });

    it('sets failed and logs on executor error', async () => {
      useStore.setState({ nodes: [makeNode('n1', 'text', 'text')] });
      mockExecuteNode.mockRejectedValue(new Error('boom'));

      await useStore.getState().runNode('n1');

      expect(useStore.getState().executionStatus).toBe('failed');
      expect(useStore.getState().failedNodeId).toBe('n1');
    });

    it('calls finishExecution when pipelineId present', async () => {
      useStore.setState({
        nodes: [makeNode('n1', 'text', 'text')],
        pipelineId: 'pipe-1',
      });
      mockStartExecution.mockResolvedValue('exec-1');
      mockExecuteNode.mockResolvedValue({});

      await useStore.getState().runNode('n1');

      expect(mockStartExecution).toHaveBeenCalled();
      expect(mockFinishExecution).toHaveBeenCalledWith(
        'exec-1',
        expect.objectContaining({ status: 'SUCCESS' }),
      );
    });
  });

  describe('runWorkflow', () => {
    it('fails when nodes are empty', async () => {
      await useStore.getState().runWorkflow();

      expect(useStore.getState().executionStatus).toBe('failed');
      expect(useStore.getState().logs[0].type).toBe('error');
    });

    it('fails on validation error and logs all errors', async () => {
      useStore.setState({ nodes: [makeNode('n1', 'customInput', 'input')] });
      mockValidatePipeline.mockReturnValue({
        isValid: false,
        errors: ['Error 1', 'Error 2'],
      });

      await useStore.getState().runWorkflow();

      expect(useStore.getState().executionStatus).toBe('failed');
      const messages = useStore.getState().logs.map((l) => l.message);
      expect(messages).toContain('Error 1');
      expect(messages).toContain('Error 2');
    });

    it('fails when no start node found', async () => {
      useStore.setState({
        nodes: [
          makeNode('t1', 'text', 'text', { text: 'hello' }),
          makeNode('out1', 'customOutput', 'output', { outputName: 'y' }),
        ],
        edges: [{ id: 'e1', source: 't1', target: 'out1' } as TPipelineEdge],
      });

      await useStore.getState().runWorkflow();

      expect(useStore.getState().executionStatus).toBe('failed');
      expect(
        useStore.getState().logs.some((l) => l.message.includes('No valid start node')),
      ).toBe(true);
    });

    it('executes start → output and marks success', async () => {
      useStore.setState({
        nodes: [
          makeNode('in1', 'customInput', 'input', { inputName: 'x', inputValue: 'hi' }),
          makeNode('out1', 'customOutput', 'output', { outputName: 'y' }),
        ],
        edges: [{ id: 'e1', source: 'in1', target: 'out1' } as TPipelineEdge],
      });
      mockExecuteNode.mockResolvedValue({ value: 'hi' });

      await useStore.getState().runWorkflow();

      expect(useStore.getState().executionStatus).toBe('success');
      expect(useStore.getState().successNodeIds).toEqual(
        expect.arrayContaining(['in1', 'out1']),
      );
    });

    it('stops workflow on node error without continueOnError', async () => {
      useStore.setState({
        nodes: [
          makeNode('in1', 'customInput', 'input', { inputName: 'x' }),
          makeNode('out1', 'customOutput', 'output', { outputName: 'y' }),
        ],
        edges: [{ id: 'e1', source: 'in1', target: 'out1' } as TPipelineEdge],
      });
      mockExecuteNode.mockRejectedValueOnce(new Error('API failed'));

      await useStore.getState().runWorkflow();

      expect(useStore.getState().executionStatus).toBe('failed');
      expect(useStore.getState().failedNodeId).toBe('in1');
    });

    it('continues on error when continueOnError is "true"', async () => {
      useStore.setState({
        nodes: [
          makeNode('in1', 'customInput', 'input', {
            inputName: 'x',
            continueOnError: 'true',
          }),
          makeNode('out1', 'customOutput', 'output', { outputName: 'y' }),
        ],
        edges: [{ id: 'e1', source: 'in1', target: 'out1' } as TPipelineEdge],
      });
      mockExecuteNode
        .mockRejectedValueOnce(new Error('boom'))
        .mockResolvedValueOnce({ value: 'fallback' });

      await useStore.getState().runWorkflow();

      expect(
        useStore.getState().logs.some((l) =>
          l.message.includes('continue by node option'),
        ),
      ).toBe(true);
    });
  });

  describe('stopWorkflow', () => {
    it('resets status to idle and logs termination', () => {
      useStore.setState({ executionStatus: 'running', startedAt: new Date().toISOString() });

      useStore.getState().stopWorkflow();

      expect(useStore.getState().executionStatus).toBe('idle');
      expect(useStore.getState().activeNodeId).toBeNull();
      expect(
        useStore.getState().logs.some((l) => l.message.includes('manually terminated')),
      ).toBe(true);
    });

    it('calls finishExecution with CANCELED status when backend id exists', () => {
      useStore.setState({
        executionStatus: 'running',
        id: 'exec-1',
        startedAt: new Date().toISOString(),
      });

      useStore.getState().stopWorkflow();

      expect(mockFinishExecution).toHaveBeenCalledWith(
        'exec-1',
        expect.objectContaining({ status: 'CANCELED' }),
      );
    });
  });
});

describe('executionSlice — extended coverage', () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
    mockValidatePipeline.mockReturnValue({ isValid: true, errors: [] });
    mockStartExecution.mockResolvedValue(null);
  });

  describe('runWorkflow — cycle detection', () => {
    it('fails when graph has infinite loop', async () => {
      useStore.setState({
        nodes: [
          makeNode('in1', 'customInput', 'input', { inputName: 'x' }),
          makeNode('t1', 'text', 'text', { text: 'a' }),
          makeNode('out1', 'customOutput', 'output', { outputName: 'y' }),
        ],
        edges: [
          { id: 'e1', source: 'in1', target: 't1' } as TPipelineEdge,
          { id: 'e2', source: 't1', target: 'out1' } as TPipelineEdge,
          { id: 'e3', source: 'out1', target: 't1' } as TPipelineEdge,
        ],
      });

      await useStore.getState().runWorkflow();

      expect(useStore.getState().executionStatus).toBe('failed');
      expect(
        useStore.getState().logs.some((l) =>
          l.message.includes('Infinite loop detected'),
        ),
      ).toBe(true);
    });
  });

  describe('runWorkflow — condition branches', () => {
    it('skips target when condition source handle does not match', async () => {
      useStore.setState({
        nodes: [
          makeNode('in1', 'customInput', 'input', { inputName: 'x' }),
          makeNode('cond1', 'conditional', 'condition', {
            value: '1',
            compareWith: '1',
            operator: '==',
          }),
          makeNode('t_true', 'text', 'text', { text: 'true branch' }),
          makeNode('t_false', 'text', 'text', { text: 'false branch' }),
        ],
        edges: [
          { id: 'e1', source: 'in1', target: 'cond1' } as TPipelineEdge,
          {
            id: 'e2',
            source: 'cond1',
            sourceHandle: 'true',
            target: 't_true',
          } as TPipelineEdge,
          {
            id: 'e3',
            source: 'cond1',
            sourceHandle: 'false',
            target: 't_false',
          } as TPipelineEdge,
        ],
      });

      mockExecuteNode.mockImplementation(async (node: TPipelineNode) => {
        if (node.id === 'in1') return { value: '1' };
        if (node.id === 'cond1') return { matched: true };
        return { text: 'executed' };
      });

      await useStore.getState().runWorkflow();

      expect(useStore.getState().successNodeIds).toContain('cond1');
      expect(useStore.getState().successNodeIds).toContain('t_true');
      expect(useStore.getState().successNodeIds).not.toContain('t_false');
    });
  });

  describe('runWorkflow — unreachable nodes', () => {
    it('fails when some nodes are unreachable', async () => {
      useStore.setState({
        nodes: [
          makeNode('in1', 'customInput', 'input', { inputName: 'x' }),
          makeNode('out1', 'customOutput', 'output', { outputName: 'y' }),
          makeNode('orphan', 'text', 'text', { text: 'orphan' }),
        ],
        edges: [
          { id: 'e1', source: 'in1', target: 'out1' } as TPipelineEdge,
        ],
      });

      mockExecuteNode.mockResolvedValue({ value: 'x' });

      await useStore.getState().runWorkflow();

      expect(useStore.getState().executionStatus).toBe('failed');
      expect(
        useStore.getState().logs.some((l) =>
          l.message.includes('unreachable or skipped'),
        ),
      ).toBe(true);
    });
  });

  describe('runWorkflow — backend integration', () => {
    it('starts and finishes execution when pipelineId present', async () => {
      useStore.setState({
        pipelineId: 'pipe-1',
        nodes: [
          makeNode('in1', 'customInput', 'input', { inputName: 'x' }),
          makeNode('out1', 'customOutput', 'output', { outputName: 'y' }),
        ],
        edges: [{ id: 'e1', source: 'in1', target: 'out1' } as TPipelineEdge],
      });
      mockStartExecution.mockResolvedValue('exec-abc');
      mockExecuteNode.mockResolvedValue({ value: 'x' });

      await useStore.getState().runWorkflow();

      expect(mockStartExecution).toHaveBeenCalledWith(
        expect.objectContaining({ pipelineId: 'pipe-1' }),
      );
      expect(useStore.getState().id).toBe('exec-abc');
      expect(mockFinishExecution).toHaveBeenCalledWith(
        'exec-abc',
        expect.objectContaining({ status: 'SUCCESS' }),
      );
    });

    it('calls finishExecution with FAILED when node throws', async () => {
      useStore.setState({
        pipelineId: 'pipe-1',
        nodes: [
          makeNode('in1', 'customInput', 'input', { inputName: 'x' }),
          makeNode('out1', 'customOutput', 'output', { outputName: 'y' }),
        ],
        edges: [{ id: 'e1', source: 'in1', target: 'out1' } as TPipelineEdge],
      });
      mockStartExecution.mockResolvedValue('exec-abc');
      mockExecuteNode.mockRejectedValue(new Error('node boom'));

      await useStore.getState().runWorkflow();

      expect(mockFinishExecution).toHaveBeenCalledWith(
        'exec-abc',
        expect.objectContaining({ status: 'FAILED' }),
      );
    });

    it('stops immediately when executionStatus changes to idle mid-workflow', async () => {
      useStore.setState({
        nodes: [
          makeNode('in1', 'customInput', 'input', { inputName: 'x' }),
          makeNode('t1', 'text', 'text', { text: 'a' }),
          makeNode('out1', 'customOutput', 'output', { outputName: 'y' }),
        ],
        edges: [
          { id: 'e1', source: 'in1', target: 't1' } as TPipelineEdge,
          { id: 'e2', source: 't1', target: 'out1' } as TPipelineEdge,
        ],
      });

      let callCount = 0;
      mockExecuteNode.mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          useStore.getState().stopWorkflow();
        }
        return {};
      });

      await useStore.getState().runWorkflow();

      expect(callCount).toBe(1);
    });
  });

  describe('runNode — backend integration', () => {
    it('starts and finishes execution when pipelineId present', async () => {
      useStore.setState({
        pipelineId: 'pipe-1',
        nodes: [makeNode('n1', 'text', 'text')],
      });
      mockStartExecution.mockResolvedValue('exec-node-1');
      mockExecuteNode.mockResolvedValue({ text: 'ok' });

      await useStore.getState().runNode('n1');

      expect(mockStartExecution).toHaveBeenCalled();
      expect(mockFinishExecution).toHaveBeenCalledWith(
        'exec-node-1',
        expect.objectContaining({ status: 'SUCCESS' }),
      );
    });

    it('calls finishExecution with FAILED when node throws', async () => {
      useStore.setState({
        pipelineId: 'pipe-1',
        nodes: [makeNode('n1', 'text', 'text')],
      });
      mockStartExecution.mockResolvedValue('exec-node-1');
      mockExecuteNode.mockRejectedValue(new Error('fail'));

      await useStore.getState().runNode('n1');

      expect(mockFinishExecution).toHaveBeenCalledWith(
        'exec-node-1',
        expect.objectContaining({ status: 'FAILED' }),
      );
    });
  });
});

describe('executionSlice — mapOutputToTarget handles', () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
    mockValidatePipeline.mockReturnValue({ isValid: true, errors: [] });
    mockStartExecution.mockResolvedValue(null);
  });

  const runPair = async (
    sourceOutput: Record<string, unknown>,
    targetNodeType: string,
    targetHandle: string,
  ) => {
    useStore.setState({
      nodes: [
        makeNode('in1', 'customInput', 'input', { inputName: 'x' }),
        makeNode('tgt', 'custom', targetNodeType),
      ],
      edges: [
        {
          id: 'e1',
          source: 'in1',
          target: 'tgt',
          targetHandle,
        } as TPipelineEdge,
      ],
    });

    mockExecuteNode.mockImplementation(async (node: TPipelineNode) => {
      if (node.id === 'in1') return sourceOutput;
      return { received: true };
    });

    await useStore.getState().runWorkflow();
  };

  it('maps source handle to target math.a', async () => {
    await runPair({ value: 10 }, 'math', 'a');
    const tgtCall = mockExecuteNode.mock.calls.find(
      ([n]: [TPipelineNode]) => n.id === 'tgt',
    );
    expect(tgtCall![1]).toMatchObject({ connectedLeftOperand: 10 });
  });

  it('maps source handle to target math.b', async () => {
    await runPair({ value: 20 }, 'math', 'b');
    const tgtCall = mockExecuteNode.mock.calls.find(
      ([n]: [TPipelineNode]) => n.id === 'tgt',
    );
    expect(tgtCall![1]).toMatchObject({ connectedRightOperand: 20 });
  });

  it('maps source handle to target condition.value', async () => {
    await runPair({ value: 'x' }, 'condition', 'value');
    const tgtCall = mockExecuteNode.mock.calls.find(
      ([n]: [TPipelineNode]) => n.id === 'tgt',
    );
    expect(tgtCall![1]).toMatchObject({ connectedValue: 'x' });
  });

  it('maps source handle to target condition.compare', async () => {
    await runPair({ value: 'y' }, 'condition', 'compare');
    const tgtCall = mockExecuteNode.mock.calls.find(
      ([n]: [TPipelineNode]) => n.id === 'tgt',
    );
    expect(tgtCall![1]).toMatchObject({ connectedCompareWith: 'y' });
  });

  it('maps source handle to target llm.system', async () => {
    await runPair({ text: 'sys' }, 'llm', 'system');
    const tgtCall = mockExecuteNode.mock.calls.find(
      ([n]: [TPipelineNode]) => n.id === 'tgt',
    );
    expect(tgtCall![1]).toMatchObject({ connectedSystemPrompt: 'sys' });
  });

  it('maps source handle to target llm.prompt', async () => {
    await runPair({ text: 'p' }, 'llm', 'prompt');
    const tgtCall = mockExecuteNode.mock.calls.find(
      ([n]: [TPipelineNode]) => n.id === 'tgt',
    );
    expect(tgtCall![1]).toMatchObject({ connectedPrompt: 'p' });
  });

  it('maps source handle to target image.image', async () => {
    await runPair({ imageUrl: 'http://img' }, 'image', 'image');
    const tgtCall = mockExecuteNode.mock.calls.find(
      ([n]: [TPipelineNode]) => n.id === 'tgt',
    );
    expect(tgtCall![1]).toMatchObject({ connectedImageUrl: 'http://img' });
  });

  it('maps source handle to target api.input', async () => {
    await runPair({ value: 'body-data' }, 'api', 'input');
    const tgtCall = mockExecuteNode.mock.calls.find(
      ([n]: [TPipelineNode]) => n.id === 'tgt',
    );
    expect(tgtCall![1]).toMatchObject({ body: 'body-data' });
  });

  it('maps source handle to target output.value', async () => {
    await runPair({ value: 'result' }, 'output', 'value');
    const tgtCall = mockExecuteNode.mock.calls.find(
      ([n]: [TPipelineNode]) => n.id === 'tgt',
    );
    expect(tgtCall![1]).toMatchObject({ value: 'result' });
  });

  it('maps source handle to var-* handle', async () => {
    await runPair({ value: 'var-value' }, 'text', 'var-name');
    const tgtCall = mockExecuteNode.mock.calls.find(
      ([n]: [TPipelineNode]) => n.id === 'tgt',
    );
    expect(tgtCall![1]).toMatchObject({ name: 'var-value' });
  });
});
