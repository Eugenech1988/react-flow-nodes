import type { TPipelineNode } from '@/entities/pipeline/model/types';
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
  executeImageNode
} from './executors';

const EXECUTORS: Record<string, TNodeExecutor> = {
  input: executeInputNode,
  output: (_node, input) => input,

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

  const executorKey = Object.keys(EXECUTORS).find(
    (key) => kind === key || kind.includes(key),
  );

  if (executorKey && EXECUTORS[executorKey]) {
    return EXECUTORS[executorKey](node, input, { pipelineId });
  }

  throw new Error(
    `No executor registered for node "${node.data?.nodeType || node.type}" (parsed as "${kind}").`,
  );
};