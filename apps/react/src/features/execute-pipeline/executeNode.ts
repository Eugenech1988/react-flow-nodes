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
  executeOutputNode,
} from './executors';

const EXECUTORS: Record<string, TNodeExecutor> = {
  input: executeInputNode,
  output: executeOutputNode,
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

const EXECUTOR_ALIASES: Record<string, string> = {
  custominput: 'input',
  customoutput: 'output',
  conditional: 'condition',
  media: 'image',
};

const FALLBACK_MATCH_KEYS = Object.keys(EXECUTORS).sort((a, b) => b.length - a.length);

const resolveExecutorKey = (kind: string): string | null => {
  const normalized = kind.toLowerCase().trim();

  if (EXECUTORS[normalized]) return normalized;

  const alias = EXECUTOR_ALIASES[normalized];
  if (alias && EXECUTORS[alias]) return alias;

  const fallback = FALLBACK_MATCH_KEYS.find((key) => normalized.includes(key));
  return fallback ?? null;
};

export const executeNode = async (
  node: TPipelineNode,
  input: TNodeExecutionResult = {},
  pipelineId?: string | null,
): Promise<TNodeExecutionResult> => {
  const kind = getNodeKind(node);
  const executorKey = resolveExecutorKey(kind);

  if (executorKey && EXECUTORS[executorKey]) {
    return EXECUTORS[executorKey](node, input, { pipelineId });
  }

  throw new Error(
    `No executor registered for node "${node.data?.nodeType || node.type}" (parsed as "${kind}").`,
  );
};
