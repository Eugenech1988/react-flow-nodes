import { useEffect, useMemo, useState } from 'react';
import { type ColumnDef, type SortingState, type TableFeatures } from '@tanstack/react-table';
import { StatusBadge } from '@/shared/ui';
import { DEFAULT_PAGE_LIMIT } from '../model/constants';
import { getEnTitle, getLocalesLabel, getStatusConfig, sortJobs } from '../model/utils';
import type { IJob } from '../model/types';
import { JobTableRowActions } from '../components';

interface UseJobsTableParams {
  jobs: IJob[];
  onEdit: (id: string) => void;
}

export const useJobsTable = ({ jobs, onEdit }: UseJobsTableParams) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(DEFAULT_PAGE_LIMIT);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<TableFeatures, IJob, unknown>[]>(
    () => [
      {
        id: 'slug',
        accessorFn: (job) => job.slug,
        header: 'Slug',
        cell: ({ row }) => (
          <span className="text-muted-foreground font-mono text-xs">{row.original.slug}</span>
        ),
      },
      {
        id: 'title',
        accessorFn: (job) => getEnTitle(job),
        header: 'Title (EN)',
        cell: ({ row }) => {
          const title = getEnTitle(row.original);
          if (title) {
            return <span className="font-medium">{title}</span>;
          }
          return (
            <span className="border-destructive/30 bg-destructive/10 text-destructive rounded border px-2 py-0.5 text-xs">
              Missing EN
            </span>
          );
        },
      },
      {
        id: 'department',
        accessorFn: (job) => job.department,
        header: 'Department',
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs uppercase">{row.original.department}</span>
        ),
      },
      {
        id: 'locales',
        accessorFn: (job) => getLocalesLabel(job),
        header: 'Locales',
        cell: ({ row }) => (
          <span className="text-muted-foreground font-mono text-xs uppercase">
            {getLocalesLabel(row.original)}
          </span>
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
        cell: ({ row }) => <JobTableRowActions job={row.original} onEdit={onEdit} />,
      },
    ],
    [onEdit],
  );

  const sortedJobs = useMemo(() => sortJobs(jobs, sorting), [jobs, sorting]);

  const totalPages = Math.max(Math.ceil(jobs.length / limit), 1);
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const paginatedJobs = useMemo(
    () => sortedJobs.slice((safePage - 1) * limit, safePage * limit),
    [sortedJobs, safePage, limit],
  );

  const handleSort = (columnId: string) => {
    setSorting((prev) => {
      const existing = prev.find((s) => s.id === columnId);
      if (!existing) return [{ id: columnId, desc: false }];
      if (!existing.desc) return [{ id: columnId, desc: true }];
      return [];
    });
  };

  return {
    paginatedJobs,
    columns,
    sorting,
    page: safePage,
    limit,
    totalPages,
    totalItems: jobs.length,
    handleSort,
    setPage,
    setLimit,
  };
};
