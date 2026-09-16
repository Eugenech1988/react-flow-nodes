import {
  createColumnHelper,
  type TableFeatures,
} from '@tanstack/react-table';
import {
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  MinusCircle,
} from 'lucide-react';

import { StatusBadge, type TStatusConfigItem } from '@/shared/ui';
import type { IExecutionItem } from '@/pages/executions/model';

const columnHelper = createColumnHelper<TableFeatures, IExecutionItem>();

const STATUS_CONFIGS: Record<string, TStatusConfigItem> = {
  success: {
    label: 'Success',
    icon: CheckCircle2,
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
  },
  running: {
    label: 'Running',
    icon: Loader2,
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    iconClassName: 'animate-spin',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
  },
  canceled: {
    label: 'Cancelled',
    icon: MinusCircle,
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
  },
  default: {
    label: 'Unknown',
    icon: AlertTriangle,
    className: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400',
  },
};

export const buildColumns = () => [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: ({ getValue }) => {
      const id = getValue() as string;

      return (
        <span title={id} className="block max-w-12 truncate text-muted-foreground cursor-help">
          {id}
        </span>
      );
    },
  }),

  columnHelper.accessor('pipelineName', {
    header: 'Pipeline',
    cell: (info) => (
      <div>
        <div className="font-medium text-muted-foreground text-xs">
          {info.getValue()}
        </div>
      </div>
    ),
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const statusKey = info.getValue() as string;
      const config = STATUS_CONFIGS[statusKey] ?? {
        ...STATUS_CONFIGS.DEFAULT,
        label: statusKey,
      };

      return <StatusBadge config={config} />;
    },
  }),

  columnHelper.accessor('triggeredBy', {
    header: 'Trigger',
    cell: (info) => (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
        <PlayCircle className="h-3.5 w-3.5 text-muted-foreground/70" />
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('nodesExecuted', {
    header: 'Nodes',
    cell: (info) => (
      <span className="text-muted-foreground text-[11px]">
        {info.getValue()} nodes
      </span>
    ),
  }),

  columnHelper.accessor('duration', {
    header: 'Duration',
    cell: (info) => (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground text-[11px]">
        <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('startedAt', {
    header: 'Started At',
    cell: (info) => (
      <span className="text-muted-foreground text-[11px]">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('finishedAt', {
    header: 'Finished At',
    cell: (info) => (
      <span className="text-muted-foreground text-[11px]">
        {info.getValue()}
      </span>
    ),
  }),
];