import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { useUser, useExecutions } from '@/shared/hooks';

import type { IExecutionItem, TExecutionStatus } from '@/pages/executions/model';

export const useExecutionsTable = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TExecutionStatus>('all');
  const [selectedExec, setSelectedExec] = useState<IExecutionItem | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const { user } = useUser();

  const {
    executions,
    totalRuns,
    totalPages,
    isLoading,
    isFetching,
    refetch
  } = useExecutions({
    pipelineId: user?.currentPipelineId ?? undefined,
    page,
    limit,
    search: searchQuery,
    status: statusFilter,
  });

  const handleSortToggle = (columnId: string) => {
    setSorting((prev) => {
      const existingSort = prev.find((s) => s.id === columnId);
      if (!existingSort) return [{ id: columnId, desc: false }];
      if (!existingSort.desc) return [{ id: columnId, desc: true }];
      return [];
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // При поиске всегда сбрасываем на 1-ю страницу
  };

  const handleTabChange = (id: string) => {
    setStatusFilter(id as TExecutionStatus);
    setPage(1); // При смене вкладки статуса сбрасываем на 1-ю страницу
  };

  // Клиентская сортировка остается для текущей страницы (или её можно тоже перенести на бэк, если нужно)
  const processedExecutions = useMemo<IExecutionItem[]>(() => {
    if (!sorting.length) return executions;

    const { id: sortKey, desc } = sorting[0];

    return [...executions].sort((a, b) => {
      const valA = a[sortKey as keyof IExecutionItem];
      const valB = b[sortKey as keyof IExecutionItem];

      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      const comparison =
        typeof valA === 'number' && typeof valB === 'number'
          ? valA - valB
          : String(valA).localeCompare(String(valB));

      return desc ? -comparison : comparison;
    });
  }, [executions, sorting]);

  return {
    searchQuery,
    statusFilter,
    isLoading,
    isFetching,
    selectedExec,
    sorting,
    processedExecutions,
    page,
    limit,
    totalPages,
    totalRuns,
    setPage,
    setLimit,
    setSelectedExec,
    setSorting,
    handleSortToggle,
    handleSearchChange,
    handleTabChange,
    handleRefresh: refetch,
  };
};