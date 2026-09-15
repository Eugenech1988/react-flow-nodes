import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import type { IExecutionItem, TRunStatus, TStatusConfig } from './types';

export const EXECUTION_TABS = [
  { id: 'all', label: 'All Runs' },
  { id: 'success', label: 'Success' },
  { id: 'failed', label: 'Failed' },
  { id: 'running', label: 'Running' },
];

export const MOCK_EXECUTIONS: IExecutionItem[] = [
  {
    id: 'exec-9821',
    workflowName: 'Data Processing & Sync Pipeline',
    workflowId: 'wf-1',
    status: 'success',
    startedAt: '2026-09-14 18:24:10',
    duration: '1.4s',
    triggeredBy: 'Manual Trigger',
    nodesExecuted: 3,
  },
  {
    id: 'exec-9820',
    workflowName: 'Customer Onboarding Webhook',
    workflowId: 'wf-2',
    status: 'failed',
    startedAt: '2026-09-14 17:50:02',
    duration: '450ms',
    triggeredBy: 'Webhook',
    nodesExecuted: 2,
  },
  {
    id: 'exec-9819',
    workflowName: 'Hourly Database Backup',
    workflowId: 'wf-3',
    status: 'running',
    startedAt: '2026-09-14 18:28:45',
    duration: 'in progress...',
    triggeredBy: 'Cron Schedule',
    nodesExecuted: 1,
  },
  {
    id: 'exec-9818',
    workflowName: 'AI Text Summarization Pipeline',
    workflowId: 'wf-4',
    status: 'success',
    startedAt: '2026-09-14 16:12:33',
    duration: '4.8s',
    triggeredBy: 'Manual Trigger',
    nodesExecuted: 5,
  },
];

export const STATUS_CONFIG: Record<TRunStatus, TStatusConfig> = {
  success: {
    label: 'Success',
    icon: CheckCircle2,
    className:
      'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  running: {
    label: 'Running',
    icon: RefreshCw,
    className:
      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    iconClassName: 'animate-spin',
  },
};