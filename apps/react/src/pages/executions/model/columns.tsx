import {
  createColumnHelper,
  type TableFeatures,
} from '@tanstack/react-table';
import { Clock, PlayCircle } from 'lucide-react';

import { StatusBadge } from '@/pages/executions/components';
import type { IExecutionItem } from '@/pages/executions/model';

const columnHelper = createColumnHelper<TableFeatures, IExecutionItem>();

export const buildColumns = () => [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-[11px] font-medium text-foreground">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('workflowName', {
    header: 'Pipeline',
    cell: (info) => (
      <div>
        <div className="font-medium text-foreground text-xs">
          {info.getValue()}
        </div>
        <div className="text-[10px] text-muted-foreground font-mono">
          {info.row.original.workflowId}
        </div>
      </div>
    ),
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
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
      <span className="text-muted-foreground font-mono text-[11px]">
        {info.getValue()} nodes
      </span>
    ),
  }),

  columnHelper.accessor('duration', {
    header: 'Duration',
    cell: (info) => (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
        <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('startedAt', {
    header: 'Started At',
    cell: (info) => (
      <span className="text-muted-foreground font-mono text-[11px]">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('startedAt', {
    header: 'Finished At',
    cell: (info) => (
      <span className="text-muted-foreground font-mono text-[11px]">
        {info.getValue()}
      </span>
    ),
  }),
];