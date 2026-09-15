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
import { EXECUTION_TABS } from '@/pages/executions/model';
import { FloatingInput, Tabs, TableSkeleton } from '@/shared/ui';
import { PAGE_VARIANTS } from '@/shared/lib';

import { buildColumns } from './model';
import type { IExecutionItem } from './model';
import { ExecutionsTable, ExecutionDetailsDialog, PageHeader } from './components';
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
    // 1. Достаем параметры и функции пагинации из хука
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
    handleRefresh
  } = useExecutionsTable();

  const columns: ColumnDef<TableFeatures, IExecutionItem, any>[] = useMemo(
    () => buildColumns(),
    []
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
      className="bg-background text-foreground p-4 md:p-6 transition-colors duration-300"
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader isFetching={isFetching} handleRefresh={handleRefresh}/>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80 group">
            <FloatingInput
              rounded="xl"
              label="Search executions"
              value={searchQuery}
              onChange={handleSearchChange}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Tabs
              tabs={EXECUTION_TABS}
              layoutId="executions-filter-tabs"
              currentTab={statusFilter}
              onTabChange={handleTabChange}
            />
          </div>
        </div>

        {(isLoading || isFetching) ? (
          <TableSkeleton rowCount={5} columnCount={8} />
        ) : (
          <ExecutionsTable
            table={table}
            columns={columns}
            sorting={sorting}
            totalRuns={totalRuns}
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

      <ExecutionDetailsDialog
        execution={selectedExec}
        onClose={() => setSelectedExec(null)}
      />
    </motion.div>
  );
};