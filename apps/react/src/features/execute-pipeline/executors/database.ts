import { trpcClient } from '@/shared/api';
import type { TCreateDatabaseNodeInputData } from '@pipeline/contracts';
import type { TNodeExecutor, TNodeExecutionResult } from '../model/types';
import { resolveTemplate } from '../model/utils';

type TDatabaseRecord = {
  data?: unknown;
};

type TCreateDatabaseRecordInput = {
  nodeId: string;
  pipelineId: string | null;
  query: string;
  params: TNodeExecutionResult;
  status: 'SUCCESS';
};

const createDatabaseRecord = async (
  input: TCreateDatabaseRecordInput,
): Promise<TDatabaseRecord> => {
  // const now = new Date();

  const payload: TCreateDatabaseNodeInputData = {
    nodeId: input.nodeId,
    pipelineId: input.pipelineId,
    query: input.query,
    params: input.params,
    status: input.status,
    data: null,
    userId: null,
  };

  return trpcClient.databaseNodes.createRecord.mutate(payload);
};

export const executeDatabaseNode: TNodeExecutor = async (node, input, context) => {
  const data = node.data;
  const query = resolveTemplate(
    String(data.query || 'SELECT * FROM table'),
    input,
  );

  const rawPipelineId =
    context?.pipelineId ||
    (data.pipelineId
      ? String(data.pipelineId)
      : input.pipelineId
        ? String(input.pipelineId)
        : null);

  const pipelineId = rawPipelineId ? String(rawPipelineId) : null;

  try {
    const record = await createDatabaseRecord({
      nodeId: node.id,
      pipelineId,
      query,
      params: input ?? {},
      status: 'SUCCESS',
    });

    const rawData = record?.data;

    let rows: unknown[] = [];

    if (Array.isArray(rawData)) {
      rows = rawData;
    } else if (rawData && typeof rawData === 'object') {
      const recordData = rawData as Record<string, unknown>;
      if (Array.isArray(recordData.result)) {
        rows = recordData.result;
      } else if (recordData.result !== undefined) {
        rows = [recordData.result];
      } else {
        rows = [rawData];
      }
    } else if (rawData !== undefined && rawData !== null) {
      rows = [rawData];
    }

    return {
      ...input,
      query,
      rows,
      status: 'SUCCESS',
    };
  } catch (error) {
    throw new Error(
      `Database node execution failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};