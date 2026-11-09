import { CheckCircle2, XCircle, RefreshCw, MinusCircle, AlertTriangle } from 'lucide-react';
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
    className: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  running: {
    label: 'Running',
    icon: RefreshCw,
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    iconClassName: 'animate-spin',
  },
};

export const EXTRA_STATUS_CONFIG: Record<string, TStatusConfig> = {
  canceled: {
    label: 'Cancelled',
    icon: MinusCircle,
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
};

export const FALLBACK_STATUS: TStatusConfig = {
  label: 'Unknown',
  icon: AlertTriangle,
  className: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
};

export const resolveStatusConfig = (key: string): TStatusConfig => {
  const known = (STATUS_CONFIG as Record<string, TStatusConfig>)[key];
  if (known) return known;

  const extra = EXTRA_STATUS_CONFIG[key];
  if (extra) return extra;

  return { ...FALLBACK_STATUS, label: key || FALLBACK_STATUS.label };
};
