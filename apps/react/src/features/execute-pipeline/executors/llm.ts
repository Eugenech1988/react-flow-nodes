import { trpcClient } from '@/shared/api';
import type { TNodeExecutor } from '../model/types';
import { resolveTemplate } from '../model/utils';

export const executeLlmNode: TNodeExecutor = async (node, input) => {
  const data = node.data;
  const rawMessage = String(
    data.prompt || data.message || data.text || input.prompt || input.message || input.text || '',
  );

  if (!rawMessage) {
    throw new Error('LLM node requires a prompt/message.');
  }

  const message = resolveTemplate(rawMessage, input);

  try {
    const mutate = trpcClient.ai.test.mutate as (
      input: { message: string },
    ) => Promise<{ text: string }>;

    const { text } = await mutate({ message });

    return {
      ...input,
      text,
      prompt: message,
    };
  } catch (error) {
    throw new Error(
      `LLM node execution failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};