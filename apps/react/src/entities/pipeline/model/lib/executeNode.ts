import type { TPipelineNode } from '@/entities/pipeline/model/types';
import { trpcClient } from '@/shared/api';

export type TNodeExecutionResult = Record<string, unknown>;

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

const resolveTemplate = (
  value: string,
  input: TNodeExecutionResult,
): string =>
  value.replace(
    /\{\{\s*([^}\s]+)\s*\}\}/g,
    (_, key: string) => String(input[key] ?? ''),
  );

const toNumber = (value: unknown, label: string): number => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return number;
};

const nodeKind = (node: TPipelineNode): string =>
  String(node.data.nodeType || node.type || '').toLowerCase();

const createDatabaseRecord = async (
  input: TCreateDatabaseRecordInput,
): Promise<TDatabaseRecord> => {
  const mutate = trpcClient.databaseNodes.createRecord.mutate as (
    input: TCreateDatabaseRecordInput,
  ) => Promise<TDatabaseRecord>;

  return mutate(input);
};

export const executeNode = async (
  node: TPipelineNode,
  input: TNodeExecutionResult = {},
  pipelineId?: string | null,
): Promise<TNodeExecutionResult> => {
  const kind = nodeKind(node);
  const data = node.data;

  if (kind.includes('input')) {
    const fieldName = String(data.inputName || 'input');

    return {
      [fieldName]: data.inputValue ?? '',
    };
  }

  if (kind.includes('text')) {
    return {
      ...input,
      text: resolveTemplate(String(data.text || ''), input),
    };
  }

  if (kind.includes('math')) {
    const left = toNumber(
      data.leftOperand ?? input.leftOperand ?? 0,
      'Left operand',
    );

    const right = toNumber(
      data.rightOperand ?? input.rightOperand ?? 0,
      'Right operand',
    );

    const operation = String(data.operation || 'add');

    const result =
      operation === 'subtract'
        ? left - right
        : operation === 'multiply'
          ? left * right
          : operation === 'divide'
            ? left / right
            : left + right;

    if (!Number.isFinite(result)) {
      throw new Error('Math operation returned an invalid result.');
    }

    return {
      ...input,
      result,
    };
  }

  if (kind.includes('condition') || kind.includes('logic')) {
    const value = String(data.value ?? input.value ?? '');
    const compareWith = String(
      data.compareWith ?? input.compareWith ?? '',
    );
    const operator = String(data.operator || '==');

    const matched =
      operator === '>'
        ? Number(value) > Number(compareWith)
        : operator === '<'
          ? Number(value) < Number(compareWith)
          : operator === '!='
            ? value !== compareWith
            : value === compareWith;

    return {
      ...input,
      matched,
    };
  }

  if (kind.includes('api')) {
    const url = resolveTemplate(String(data.url || ''), input);

    if (!url) {
      throw new Error('Endpoint URL is required.');
    }

    const response = await fetch(url, {
      method: String(data.method || 'GET'),
    });

    const contentType = response.headers.get('content-type') || '';

    const body = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(`API request failed with ${response.status}.`);
    }

    return {
      ...input,
      response: body,
      status: response.status,
    };
  }

  if (kind.includes('output')) {
    return input;
  }

  if (kind.includes('database')) {
    const query = resolveTemplate(
      String(data.query || 'SELECT * FROM table'),
      input,
    );

    try {
      const record = await createDatabaseRecord({
        nodeId: node.id,
        pipelineId:
          pipelineId ||
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
  }

  if (kind.includes('llm') || kind.includes('image')) {
    throw new Error(
      `The ${node.data.nodeType || node.type} node needs a configured server-side executor and credentials.`,
    );
  }

  throw new Error(
    `No executor is registered for node type "${node.data.nodeType || node.type}".`,
  );
};
