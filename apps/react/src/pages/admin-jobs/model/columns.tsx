import type { ColumnDef, TableFeatures } from '@tanstack/react-table';
import { StatusBadge } from '@/shared/ui';
import { getEnTitle, getLocalesLabel, getStatusConfig } from './utils';
import type { IJob } from './types';
import { JobTableRowActions } from '../components/JobTableRowActions';

export const buildJobColumns = (
  onEdit: (id: string) => void
): ColumnDef<TableFeatures, IJob, unknown>[] => [
  {
    id: 'slug',
    accessorFn: (job) => job.slug,
    header: 'Slug',
    cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.original.slug}</span>,
  },
  {
    id: 'title',
    accessorFn: (job) => getEnTitle(job),
    header: 'Title (EN)',
    cell: ({ row }) => {
      const title = getEnTitle(row.original);
      if (title) {
        return <span className="text-foreground text-xs font-medium">{title}</span>;
      }
      return (
        <span className="border-destructive/30 bg-destructive/10 text-destructive rounded border px-2 py-0.5 text-[11px]">
          Missing EN
        </span>
      );
    },
  },
  {
    id: 'department',
    accessorFn: (job) => job.department,
    header: 'Department',
    cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.original.department}</span>,
  },
  {
    id: 'locales',
    accessorFn: (job) => getLocalesLabel(job),
    header: 'Locales',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">{getLocalesLabel(row.original)}</span>
    ),
  },
  {
    id: 'status',
    accessorFn: (job) => job.status,
    header: 'Status',
    cell: ({ row }) => <StatusBadge config={getStatusConfig(row.original.status)} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    meta: {
      headerClassName: 'justify-center',
      cellClassName: 'justify-center',
    },
    cell: ({ row }) => <JobTableRowActions job={row.original} onEdit={onEdit} />,
  },
];