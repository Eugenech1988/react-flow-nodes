import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import type { IExecutionItem } from '@/pages/executions/model';
import { formatDate, formatDuration } from '@/shared/lib';

interface UseExecutionsOptions {
  pipelineId?: string;
  enabled?: boolean;
}

export const useExecutions = (options?: UseExecutionsOptions) => {
  const trpc = useTRPC();

  const queryOptions = trpc.executions.list.queryOptions(
    options?.pipelineId ? { pipelineId: options.pipelineId } : undefined
  );

  const query = useQuery({
    ...queryOptions,
    enabled: options?.enabled ?? true,

    select: (data: typeof queryOptions['_A']): IExecutionItem[] => {
      if (!Array.isArray(data)) return [];

      return data.map((item) => ({
        id: item.id,
        pipelineId: item.pipelineId,
        pipelineName: item.pipeline?.name ?? '—',
        status: item.status.toLowerCase(),
        triggeredBy: item.triggeredBy,
        nodesExecuted: item.nodesExecuted,
        startedAt: formatDate(item.startedAt),
        finishedAt: formatDate(item.finishedAt) ?? 'In progress...',
        duration: formatDuration(item.durationMs),
      }));
    },

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return {
    executions: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};