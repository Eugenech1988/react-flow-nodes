import type { LucideIcon } from 'lucide-react';
import type { TExecutionLog } from '@/entities';

export type TExecutionStatus = 'all' | 'success' | 'failed' | 'running';
export type TRunStatus = Exclude<TExecutionStatus, 'all'>;

export interface IExecutionItem {
  id: string;
  pipelineName: string;
  pipelineId: string;
  status: TRunStatus;
  duration: string;
  triggeredBy: string;
  nodesExecuted: number;
  startedAt: string;
  finishedAt: string;
  logs: TExecutionLog[];
}

export type TSortState = false | 'asc' | 'desc';

export type TStatusConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
  iconClassName?: string;
};