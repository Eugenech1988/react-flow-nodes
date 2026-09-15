import type { LucideIcon } from 'lucide-react';

export type TExecutionStatus = 'all' | 'success' | 'failed' | 'running';
export type TRunStatus = Exclude<TExecutionStatus, 'all'>;

export interface IExecutionItem {
  id: string;
  workflowName: string;
  workflowId: string;
  status: TRunStatus;
  startedAt: string;
  duration: string;
  triggeredBy: string;
  nodesExecuted: number;
}

export type TSortState = false | 'asc' | 'desc';

export type TStatusConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
  iconClassName?: string;
};