import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';

interface UseExecutionsOptions {
  pipelineId?: string;
  enabled?: boolean;
}

export const useExecutions = (options?: UseExecutionsOptions) => {
  const trpc = useTRPC();

  const query = useQuery({
    ...trpc.executions.list.queryOptions(
      options?.pipelineId ? { pipelineId: options.pipelineId } : undefined
    ),
    enabled: options?.enabled ?? true,
  });

  return {
    executions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};