import { useEffect, useMemo, useState } from 'react';
import { type SortingState } from '@tanstack/react-table';
import { DEFAULT_PAGE_LIMIT } from '../model/constants';
import { sortJobs, type IJob, buildJobColumns } from '../model';

interface UseJobsTableParams {
  jobs: IJob[];
  onEdit: (id: string) => void;
}

export const useJobsTable = ({ jobs, onEdit }: UseJobsTableParams) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(DEFAULT_PAGE_LIMIT);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => buildJobColumns(onEdit), [onEdit]);
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
