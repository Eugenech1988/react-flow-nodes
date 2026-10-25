import type { TPipelineNode } from '@/entities';
import type { TNodeExecutionResult, TNodeExecutor } from './model/types';
import { getNodeKind } from './model/utils';

import {
  executeInputNode,
  executeTextNode,
  executeMathNode,
  executeConditionNode,
  executeApiNode,
  executeDatabaseNode,
  executeLlmNode,
  executeImageNode,
} from './executors';

const EXECUTORS: Record<string, TNodeExecutor> = {
  input: executeInputNode,
  output: (node, input) => {
    const outputName = String(node.data.outputName || 'output');
    const value =
      node.data.outputType === 'image'
        ? (input.imageUrl ?? input.processed ?? input.value ?? '')
        : (input.value ??
          input.result ??
          input.text ??
          input.response ??
          input.rows ??
          input.inputValue ??
          input);
    return { ...input, [outputName]: value, output: value };
  },

  text: executeTextNode,
  image: executeImageNode,

  llm: executeLlmNode,
  math: executeMathNode,
  condition: executeConditionNode,
  logic: executeConditionNode,

  api: executeApiNode,
  database: executeDatabaseNode,
  db: executeDatabaseNode,
};

export const executeNode = async (
  node: TPipelineNode,
  input: TNodeExecutionResult = {},
  pipelineId?: string | null,
): Promise<TNodeExecutionResult> => {
  const kind = getNodeKind(node);

  const executorKey = Object.keys(EXECUTORS).find((key) => kind === key || kind.includes(key));

  if (executorKey && EXECUTORS[executorKey]) {
    return EXECUTORS[executorKey](node, input, { pipelineId });
  }

  throw new Error(
    `No executor registered for node "${node.data?.nodeType || node.type}" (parsed as "${kind}").`,
  );
};
