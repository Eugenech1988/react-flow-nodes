import { trpcClient } from '@/shared/api';
import type {
  TCreateExecutionInputData,
  TUpdateExecutionInputData,
  // TTriggerType as TBackendTriggerType,
} from '@pipeline/contracts';
import type { TExecutionLog, TTriggerType as TUiTriggerType } from '@/entities/pipeline/model/types';
import { mapTriggerType, formatLogsToRecord } from '@/features/execute-pipeline/model/utils.ts';

export const pipelineExecutionService = {
  async startExecution(params: {
    pipelineId: string;
    userId?: string;
    triggeredBy?: TUiTriggerType | string;
    logs?: TExecutionLog[];
  }): Promise<string | null> {
    const payload: TCreateExecutionInputData = {
      pipelineId: params.pipelineId,
      userId: params.userId ?? '',
      status: 'RUNNING',
      triggeredBy: mapTriggerType(params.triggeredBy),
      nodesExecuted: 0,
      logs: params.logs ? formatLogsToRecord(params.logs) : {},
    };

    try {
      const response = await trpcClient.executions.create.mutate(payload);
      return response?.id ?? null;
    } catch (err) {
      console.error('[PipelineExecutionService] Failed to create execution in BE:', err);
      return null;
    }
  },

  async finishExecution(
    executionId: string,
    params: {
      status: 'SUCCESS' | 'FAILED' | 'CANCELED';
      finishedAt: string;
      durationMs: number;
      nodesExecuted: number;
      logs: TExecutionLog[];
    },
  ) {
    const payload: TUpdateExecutionInputData = {
      status: params.status,
      finishedAt: params.finishedAt,
      durationMs: params.durationMs,
      nodesExecuted: params.nodesExecuted,
      logs: formatLogsToRecord(params.logs),
    };

    try {
      await trpcClient.executions.update.mutate({
        id: executionId,
        data: payload,
      });
    } catch (err) {
      console.error(`[PipelineExecutionService] Failed to update execution ${executionId} in BE:`, err);
    }
  },
};