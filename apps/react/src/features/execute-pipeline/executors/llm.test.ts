import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeLlmNode } from './llm';
import type { TPipelineNode } from '@/entities';

const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }));

vi.mock('@/shared/api', () => ({
  trpcClient: {
    ai: {
      test: { mutate: mockMutate },
    },
  },
}));

const makeNode = (data: Record<string, unknown>): TPipelineNode =>
  ({ id: 'n1', type: 'llm', position: { x: 0, y: 0 }, data }) as unknown as TPipelineNode;

describe('executeLlmNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws when no prompt available', async () => {
    const node = makeNode({});
    await expect(executeLlmNode(node, {})).rejects.toThrow('LLM node requires a prompt');
  });

  it('sends message and system to trpc', async () => {
    mockMutate.mockResolvedValue({ text: 'response' });
    const node = makeNode({ prompt: 'Say hello', systemPrompt: 'Be nice' });
    const result = await executeLlmNode(node, {});

    expect(mockMutate).toHaveBeenCalledWith({ message: 'Say hello', system: 'Be nice' });
    expect(result.text).toBe('response');
    expect(result.prompt).toBe('Say hello');
  });

  it('resolves templates in message and system', async () => {
    mockMutate.mockResolvedValue({ text: 'ok' });
    const node = makeNode({ prompt: 'Hi {{name}}', systemPrompt: 'You are {{role}}' });
    await executeLlmNode(node, { name: 'Alice', role: 'helper' });

    expect(mockMutate).toHaveBeenCalledWith({ message: 'Hi Alice', system: 'You are helper' });
  });

  it('uses default system prompt', async () => {
    mockMutate.mockResolvedValue({ text: 'ok' });
    const node = makeNode({ prompt: 'Hi' });
    await executeLlmNode(node, {});

    expect(mockMutate).toHaveBeenCalledWith({
      message: 'Hi',
      system: 'You are a helpful assistant.',
    });
  });

  it('uses connectedPrompt', async () => {
    mockMutate.mockResolvedValue({ text: 'ok' });
    const node = makeNode({});
    await executeLlmNode(node, { connectedPrompt: 'from parent' });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'from parent' })
    );
  });

  it('wraps mutation errors', async () => {
    mockMutate.mockRejectedValue(new Error('API quota'));
    const node = makeNode({ prompt: 'Hi' });
    await expect(executeLlmNode(node, {})).rejects.toThrow('LLM node execution failed: API quota');
  });
});

describe('executeLlmNode — extra coverage', () => {
  it('wraps non-Error throws correctly', async () => {
    mockMutate.mockRejectedValue('string-error');
    const node = makeNode({ prompt: 'Hi' });

    await expect(executeLlmNode(node, {})).rejects.toThrow(
      'LLM node execution failed: string-error'
    );
  });

  it('uses data.message when data.prompt missing', async () => {
    mockMutate.mockResolvedValue({ text: 'ok' });
    const node = makeNode({ message: 'from message' });
    await executeLlmNode(node, {});

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'from message' })
    );
  });

  it('uses input.prompt when data missing', async () => {
    mockMutate.mockResolvedValue({ text: 'ok' });
    const node = makeNode({});
    await executeLlmNode(node, { prompt: 'from input' });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'from input' })
    );
  });

  it('uses input.text as fallback', async () => {
    mockMutate.mockResolvedValue({ text: 'ok' });
    const node = makeNode({});
    await executeLlmNode(node, { text: 'from text' });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'from text' })
    );
  });

  it('uses connectedSystemPrompt for system', async () => {
    mockMutate.mockResolvedValue({ text: 'ok' });
    const node = makeNode({ prompt: 'Hi' });
    await executeLlmNode(node, { connectedSystemPrompt: 'Custom system' });

    expect(mockMutate).toHaveBeenCalledWith({
      message: 'Hi',
      system: 'Custom system',
    });
  });
});
