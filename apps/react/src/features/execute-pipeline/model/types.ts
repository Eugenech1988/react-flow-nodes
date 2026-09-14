import type { TPipelineNode } from '@/entities/pipeline/model/types';

export type TNodeExecutionResult = Record<string, unknown>;

export type TNodeExecutorContext = {
  pipelineId?: string | null;
};

export type TNodeExecutor = (
  node: TPipelineNode,
  input: TNodeExecutionResult,
  context?: TNodeExecutorContext,
) => Promise<TNodeExecutionResult> | TNodeExecutionResult;