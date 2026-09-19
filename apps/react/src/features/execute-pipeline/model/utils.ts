import type { TExecutionLog, TPipelineNode, TTriggerType as TUiTriggerType } from '@/entities/pipeline/model/types';
import type { TNodeExecutionResult } from './types';
import type { TTriggerType as TBackendTriggerType } from '@pipeline/contracts';

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


export const mapTriggerType = (trigger?: TUiTriggerType | string): TBackendTriggerType => {
  if (trigger === 'SCHEDULED') return 'CRON';
  if (trigger === 'WEBHOOK' || trigger === 'CRON' || trigger === 'API') {
    return trigger;
  }
  return 'MANUAL';
};

export const formatLogsToRecord = (
  logs: TExecutionLog[]
): Record<string, Omit<TExecutionLog, 'timestamp'> & { timestamp: number }> => {
  return logs.reduce<Record<string, Omit<TExecutionLog, 'timestamp'> & { timestamp: number }>>(
    (acc, log, index) => {
      let parsedTimestamp: number;

      if (typeof log.timestamp === 'number') {
        parsedTimestamp = log.timestamp;
      } else if (!isNaN(Number(log.timestamp))) {
        parsedTimestamp = Number(log.timestamp);
      } else {
        const time = new Date(log.timestamp).getTime();
        parsedTimestamp = isNaN(time) ? Date.now() : time;
      }

      acc[log.id || `log_${index}`] = {
        ...log,
        timestamp: parsedTimestamp,
      };

      return acc;
    },
    {}
  );
};