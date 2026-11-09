import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  type TableFeatures,
} from '@tanstack/react-table';
import { UniversalTable, TableSkeleton } from '@/shared/ui';
import { useJobsTable } from '../hooks/useJobsTable';
import { JobsTableEmpty } from './JobsTableEmpty';
import type { IJob } from '../model/types';

interface JobsTableProps {
  jobs: IJob[];
  onEdit: (id: string) => void;
  isLoading?: boolean;
}

export function JobTable({ jobs, onEdit, isLoading = false }: JobsTableProps) {
  const {
    paginatedJobs,
    columns,
    sorting,
    page,
    limit,
    totalPages,
    totalItems,
    handleSort,
    setPage,
    setLimit,
  } = useJobsTable({ jobs, onEdit });

  const table = useTable<TableFeatures, IJob>({
    data: paginatedJobs,
    columns,
    features: tableFeatures({ rowSortingFeature }),
  });

  if (isLoading) {
    return (
      <div className="animate-in fade-in duration-200">
        <TableSkeleton rowCount={limit} columnCount={6} />
      </div>
    );
  }

  if (jobs.length === 0) {
    return <JobsTableEmpty />;
  }

  return (
    <UniversalTable
      table={table}
      columns={columns}
      sorting={sorting}
      totalItems={totalItems}
      page={page}
      totalPages={totalPages}
      limit={limit}
      onSort={handleSort}
      onPageChange={setPage}
      onLimitChange={setLimit}
      itemsUnitLabel="vacancies"
      noDataText="No vacancies on this page."
    />
  );
}