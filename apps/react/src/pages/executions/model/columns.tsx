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
      <span className="text-muted-foreground  text-[11px]">
        {info.getValue()} nodes
      </span>
    ),
  }),

  columnHelper.accessor('duration', {
    header: 'Duration',
    cell: (info) => (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground  text-[11px]">
        <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('startedAt', {
    header: 'Started At',
    cell: (info) => (
      <span className="text-muted-foreground  text-[11px]">
        {info.getValue()}
      </span>
    ),
  }),

  columnHelper.accessor('finishedAt', {
    header: 'Finished At',
    cell: (info) => (
      <span className="text-muted-foreground  text-[11px]">
        {info.getValue()}
      </span>
    ),
  }),
];