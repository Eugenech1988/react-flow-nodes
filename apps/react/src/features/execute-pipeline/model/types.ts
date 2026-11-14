import type { TPipelineNode } from '@/entities';

export const TTERMINAL_KEYS = [
  'value',
  'result',
  'text',
  'response',
  'imageUrl',
  'rows',
  'inputValue',
] as const;

export type TTerminalKey = (typeof TTERMINAL_KEYS)[number];

export type TNodeExecutionResult = Record<string, unknown> & {
  [K in TTerminalKey]?: unknown;
};

export type TNodeExecutorContext = {
  pipelineId?: string | null;
};

export type TNodeExecutor = (
  node: TPipelineNode,
  input: TNodeExecutionResult,
  context?: TNodeExecutorContext,
) => Promise<TNodeExecutionResult> | TNodeExecutionResult;

export const getTerminalValue = (output: TNodeExecutionResult): unknown => {
  for (const key of TTERMINAL_KEYS) {
    if (output[key] != null) return output[key];
  }
  return output;
};
