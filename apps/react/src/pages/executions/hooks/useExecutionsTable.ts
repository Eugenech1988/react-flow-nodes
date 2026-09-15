import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { useExecutions } from '@/shared/hooks/useExecutions';

import type { IExecutionItem, TExecutionStatus } from '@/pages/executions/model';

export const useExecutionsTable = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TExecutionStatus>('all');
  const [selectedExec, setSelectedExec] = useState<IExecutionItem | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { executions, isLoading } = useExecutions();

  const handleSortToggle = (columnId: string) => {
    setSorting((prev) => {
      const existingSort = prev.find((s) => s.id === columnId);
      if (!existingSort) return [{ id: columnId, desc: false }];
      if (!existingSort.desc) return [{ id: columnId, desc: true }];
      return [];
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const handleTabChange = (id: string) =>
    setStatusFilter(id as TExecutionStatus);

  const processedExecutions = useMemo<IExecutionItem[]>(() => {
    const query = searchQuery.toLowerCase();

    const filtered = executions.filter((exec) => {
      const matchesSearch =
        exec.pipelineName.toLowerCase().includes(query) ||
        exec.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        exec.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    if (!sorting.length) return filtered;

    const { id: sortKey, desc } = sorting[0];

    return [...filtered].sort((a, b) => {
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

  }, [executions, searchQuery, statusFilter, sorting]);

  return {
    searchQuery,
    statusFilter,
    isLoading,
    selectedExec,
    sorting,
    processedExecutions,
    setSelectedExec,
    setSorting,
    handleSortToggle,
    handleSearchChange,
    handleTabChange,
  };
};