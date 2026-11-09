import type { ColumnDef, TableFeatures } from '@tanstack/react-table';
import { Clock, PlayCircle } from 'lucide-react';

import { StatusBadge } from '@/shared/ui';
import type { IExecutionItem } from './types';
import { resolveStatusConfig } from './constants';

export const buildColumns = (): ColumnDef<TableFeatures, IExecutionItem, unknown>[] => [
  {
    id: 'id',
    accessorFn: (row) => row.id,
    header: 'ID',
    cell: ({ row }) => (
      <span
        title={row.original.id}
        className="text-muted-foreground block max-w-12 cursor-help truncate"
      >
        {row.original.id}
      </span>
    ),
  },

  {
    id: 'pipelineName',
    accessorFn: (row) => row.pipelineName,
    header: 'Pipeline',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs font-medium">{row.original.pipelineName}</span>
    ),
  },

  {
    id: 'status',
    accessorFn: (row) => row.status,
    header: 'Status',
    cell: ({ row }) => <StatusBadge config={resolveStatusConfig(row.original.status)} />,
  },

  {
    id: 'triggeredBy',
    accessorFn: (row) => row.triggeredBy,
    header: 'Trigger',
    cell: ({ row }) => (
      <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
        <PlayCircle className="text-muted-foreground/70 h-3.5 w-3.5" />
        {row.original.triggeredBy}
      </span>
    ),
  },

  {
    id: 'nodesExecuted',
    accessorFn: (row) => row.nodesExecuted,
    header: 'Nodes',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-[11px]">{row.original.nodesExecuted} nodes</span>
    ),
  },

  {
    id: 'duration',
    accessorFn: (row) => row.duration,
    header: 'Duration',
    cell: ({ row }) => (
      <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[11px]">
        <Clock className="text-muted-foreground/70 h-3.5 w-3.5" />
        {row.original.duration}
      </span>
    ),
  },

  {
    id: 'startedAt',
    accessorFn: (row) => row.startedAt,
    header: 'Started At',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-[11px]">{row.original.startedAt}</span>
    ),
  },

  {
    id: 'finishedAt',
    accessorFn: (row) => row.finishedAt,
    header: 'Finished At',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-[11px]">{row.original.finishedAt}</span>
    ),
  },
];
