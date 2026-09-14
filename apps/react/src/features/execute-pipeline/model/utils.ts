import type { TPipelineNode } from '@/entities/pipeline/model/types';
import type { TNodeExecutionResult } from './types';

export const resolveTemplate = (
  value: string,
  input: TNodeExecutionResult,
): string =>
  value.replace(
    /\{\{\s*([^}\s]+)\s*\}\}/g,
    (_, key: string) => String(input[key] ?? ''),
  );

export const toNumber = (value: unknown, label: string): number => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return number;
};

export const getNodeKind = (node: TPipelineNode): string =>
  String(node.data.nodeType || node.type || '').toLowerCase();