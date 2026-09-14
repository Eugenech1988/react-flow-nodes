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

type TMathOperation =
  | 'add' | 'subtract' | 'multiply' | 'divide'
  | 'modulo' | 'power' | 'min' | 'max' | 'avg'
  | 'abs' | 'round' | 'floor' | 'ceil' | 'sqrt' | 'negate';

const UNARY_OPS: ReadonlySet<TMathOperation> = new Set([
  'abs', 'round', 'floor', 'ceil', 'sqrt', 'negate',
]);

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

const resolveOperands = (
  raw: unknown,
  input: TNodeExecutionResult,
): number[] => {
  if (Array.isArray(raw)) {
    return raw.map((item) =>
      toNumber(resolveTemplate(String(item), input), 'Operand'),
    );
  }

  if (typeof raw === 'string' && raw.includes(',')) {
    return raw
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => toNumber(resolveTemplate(part, input), 'Operand'));
  }

  return [toNumber(resolveTemplate(String(raw ?? 0), input), 'Operand')];
};

const applyBinary = (op: TMathOperation, a: number, b: number): number => {
  switch (op) {
    case 'add':      return a + b;
    case 'subtract': return a - b;
    case 'multiply': return a * b;
    case 'divide':
      if (b === 0) throw new Error('Division by zero is not allowed.');
      return a / b;
    case 'modulo':
      if (b === 0) throw new Error('Modulo by zero is not allowed.');
      return a % b;
    case 'power':    return a ** b;
    case 'min':      return Math.min(a, b);
    case 'max':      return Math.max(a, b);
    case 'avg':      return (a + b) / 2;
    default:
      throw new Error(`Unsupported binary operation "${op}".`);
  }
};

const applyUnary = (op: TMathOperation, a: number): number => {
  switch (op) {
    case 'abs':    return Math.abs(a);
    case 'round':  return Math.round(a);
    case 'floor':  return Math.floor(a);
    case 'ceil':   return Math.ceil(a);
    case 'sqrt':
      if (a < 0) throw new Error('Cannot take sqrt of a negative number.');
      return Math.sqrt(a);
    case 'negate': return -a;
    default:
      throw new Error(`Unsupported unary operation "${op}".`);
  }
};

const applyNary = (op: TMathOperation, values: number[]): number => {
  if (values.length === 0) {
    throw new Error(`Operation "${op}" requires at least one operand.`);
  }
  switch (op) {
    case 'add':      return values.reduce((acc, v) => acc + v, 0);
    case 'multiply': return values.reduce((acc, v) => acc * v, 1);
    case 'min':      return Math.min(...values);
    case 'max':      return Math.max(...values);
    case 'avg':      return values.reduce((acc, v) => acc + v, 0) / values.length;
    default:
      throw new Error(`Operation "${op}" does not support n operands.`);
  }
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
    const operation = String(
      data.operation || 'add',
    ).toLowerCase() as TMathOperation;

    const operandsRaw = data.operands ?? [
      data.leftOperand ?? input.leftOperand ?? 0,
      data.rightOperand ?? input.rightOperand ?? 0,
    ];

    const operands = resolveOperands(operandsRaw, input);

    let result: number;

    if (UNARY_OPS.has(operation)) {
      if (operands.length < 1) {
        throw new Error(`Operation "${operation}" requires one operand.`);
      }
      result = applyUnary(operation, operands[0]);
    } else if (operands.length > 2) {
      result = applyNary(operation, operands);
    } else if (operands.length === 2) {
      result = applyBinary(operation, operands[0], operands[1]);
    } else {
      result = applyNary(operation, operands);
    }

    const precision = data.precision;
    if (precision !== undefined && precision !== null && precision !== '') {
      const p = toNumber(precision, 'Precision');
      if (p < 0 || p > 20) {
        throw new Error('Precision must be between 0 and 20.');
      }
      const factor = 10 ** p;
      result = Math.round(result * factor) / factor;
    }

    if (!Number.isFinite(result)) {
      throw new Error('Math operation returned an invalid result.');
    }

    return {
      ...input,
      result,
      operands,
      operation,
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