import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import type { IExecutionItem } from '@/pages/executions/model';
import { formatDate, formatDuration } from '@/shared/lib';

interface UseExecutionsOptions {
  pipelineId?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

export const useExecutions = (options?: UseExecutionsOptions) => {
  const trpc = useTRPC();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;

  const queryOptions = trpc.executions.list.queryOptions({
    pipelineId: options?.pipelineId,
    page,
    limit,
    search: options?.search,
    status: options?.status,
  });

  const query = useQuery({
    ...queryOptions,
    enabled: options?.enabled ?? true,

    select: (data) => {
      const items = Array.isArray(data) ? data : (data?.items ?? []);
      const total = Array.isArray(data) ? data.length : (data?.total ?? items.length);

      const executions: IExecutionItem[] = items.map((item) => ({
        id: item.id,
        pipelineId: item.pipelineId,
        pipelineName: item.pipeline?.name ?? '—',
        status: item.status.toLowerCase(),
        triggeredBy: item.triggeredBy,
        nodesExecuted: item.nodesExecuted,
        startedAt: formatDate(item.startedAt),
        finishedAt: item.finishedAt ? formatDate(item.finishedAt) : 'In progress...',
        duration: formatDuration(item.durationMs),
      }));

      return {
        executions,
        total,
        totalPages: Math.ceil(total / limit),
      };
    },

    staleTime: 1000 * 60 * 2, // 2 минуты свежие данные
    placeholderData: (previousData) => previousData, // Сохраняет старые данные при переключении страниц (нет мигания лоадера)
  });

  return {
    executions: query.data?.executions ?? [],
    totalRuns: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};