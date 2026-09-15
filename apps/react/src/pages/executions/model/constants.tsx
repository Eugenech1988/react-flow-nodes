import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import type { TRunStatus, TStatusConfig } from './types';

export const EXECUTION_TABS = [
  { id: 'all', label: 'All Runs' },
  { id: 'success', label: 'Success' },
  { id: 'failed', label: 'Failed' },
  { id: 'running', label: 'Running' },
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