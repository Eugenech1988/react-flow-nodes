import { trpcClient } from '@/shared/api';
import type { TNodeExecutor } from '../model/types';
import { resolveTemplate } from '../model/utils';

export const executeLlmNode: TNodeExecutor = async (node, input) => {
  const data = node.data;
  const rawMessage = String(
    input.connectedPrompt ??
      data.prompt ??
      data.message ??
      input.prompt ??
      input.message ??
      input.text ??
      '',
  );

  if (!rawMessage) {
    throw new Error('LLM node requires a prompt/message.');
  }

  const message = resolveTemplate(rawMessage, input);
  const system = resolveTemplate(
    String(input.connectedSystemPrompt ?? data.systemPrompt ?? 'You are a helpful assistant.'),
    input,
  );

  try {
    const mutate = trpcClient.ai.test.mutate as (input: {
      message: string;
      system: string;
    }) => Promise<{ text: string }>;

    const { text } = await mutate({ message, system });

    return {
      ...input,
      text,
      prompt: message,
    };
  } catch (error) {
    throw new Error(
      `LLM node execution failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
