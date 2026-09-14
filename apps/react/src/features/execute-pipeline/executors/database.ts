import { trpcClient } from '@/shared/api';
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
  const mutate = trpcClient.databaseNodes.createRecord.mutate as (
    input: TCreateDatabaseRecordInput,
  ) => Promise<TDatabaseRecord>;

  return mutate(input);
};

export const executeDatabaseNode: TNodeExecutor = async (node, input, context) => {
  const data = node.data;
  const query = resolveTemplate(
    String(data.query || 'SELECT * FROM table'),
    input,
  );

  try {
    const record = await createDatabaseRecord({
      nodeId: node.id,
      pipelineId:
        context?.pipelineId ||
        (data.pipelineId
          ? String(data.pipelineId)
          : input.pipelineId
            ? String(input.pipelineId)
            : null),
      query,
      params: input,
      status: 'SUCCESS',
    });

    const rawData = record.data;

    const recordData =
      rawData && typeof rawData === 'object'
        ? (rawData as Record<string, unknown>)
        : {};

    const queryResult =
      'result' in recordData ? recordData.result : rawData;

    return {
      ...input,
      query,
      rows: Array.isArray(queryResult)
        ? queryResult
        : queryResult
          ? [queryResult]
          : [],
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