import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useUser } from '@/shared/hooks';
import { useExecutions } from './useExecutions';
import type { IExecutionItem, TExecutionStatus } from '../model';

export const useExecutionsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TExecutionStatus>('all');
  const [selectedExec, setSelectedExec] = useState<IExecutionItem | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { user } = useUser();

  const { executions, totalRuns, totalPages, isLoading, isFetching, refetch } = useExecutions({
    pipelineId: user?.currentPipelineId ?? undefined,
    page,
    limit,
    search: searchQuery,
    status: statusFilter,
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleTabChange = (id: string) => {
    setStatusFilter(id as TExecutionStatus);
    setPage(1);
  };

  const processedExecutions = useMemo<IExecutionItem[]>(() => executions, [executions]);

  return {
    searchQuery,
    statusFilter,
    isLoading,
    isFetching,
    selectedExec,
    processedExecutions,
    page,
    limit,
    totalPages,
    totalRuns,
    setPage,
    setLimit,
    setSelectedExec,
    handleSearchChange,
    handleTabChange,
    handleRefresh: refetch,
  };
};
