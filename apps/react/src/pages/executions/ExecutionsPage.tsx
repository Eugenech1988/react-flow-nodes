import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  type ColumnDef,
  type TableFeatures,
} from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { EXECUTION_TABS } from './model';
import { FloatingInput, Tabs, TableSkeleton, UniversalTable } from '@/shared/ui';
import { PAGE_VARIANTS } from '@/shared/lib';

import { buildColumns } from './model';
import type { IExecutionItem } from './model';
import { ExecutionDetailsDialog, PageHeader } from './components';
import { useExecutionsTable } from './hooks';

export const ExecutionsPage = () => {
  const {
    searchQuery,
    statusFilter,
    selectedExec,
    sorting,
    isLoading,
    isFetching,
    processedExecutions,
    page,
    totalPages,
    limit,
    totalRuns,
    setPage,
    setLimit,
    setSelectedExec,
    setSorting,
    handleSortToggle,
    handleSearchChange,
    handleTabChange,
    handleRefresh,
  } = useExecutionsTable();

  const columns = useMemo<ColumnDef<TableFeatures, IExecutionItem>[]>(
    () => buildColumns() as ColumnDef<TableFeatures, IExecutionItem>[],
    [],
  );

  const table = useTable<TableFeatures, IExecutionItem>({
    data: processedExecutions,
    columns,
    features: tableFeatures({
      rowSortingFeature,
    }),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <motion.div
      className="bg-background text-foreground p-4 transition-colors duration-300 md:p-6"
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader isFetching={isFetching} handleRefresh={handleRefresh} />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="group relative w-full sm:w-80">
            <FloatingInput
              rounded="xl"
              label="Search executions"
              value={searchQuery}
              onChange={handleSearchChange}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <Tabs
              tabs={EXECUTION_TABS}
              layoutId="executions-filter-tabs"
              currentTab={statusFilter}
              onTabChange={handleTabChange}
            />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rowCount={5} columnCount={8} />
        ) : (
          <UniversalTable
            table={table}
            columns={columns}
            sorting={sorting}
            totalItems={totalRuns}
            itemsUnitLabel="runs"
            noDataText="No executions found matching your filters."
            page={page}
            totalPages={totalPages}
            limit={limit}
            onSort={handleSortToggle}
            onSelect={setSelectedExec}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        )}
      </div>

      <ExecutionDetailsDialog execution={selectedExec} onClose={() => setSelectedExec(null)} />
    </motion.div>
  );
};
