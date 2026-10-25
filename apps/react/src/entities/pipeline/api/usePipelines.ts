import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { useUser } from '@/shared/hooks';
import type { TPipeline } from '../model/types';

export function usePipelines() {
  const { user } = useUser();
  const trpc = useTRPC();
  const userId = user?.id;

  const {
    data: pipelines,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    ...trpc.pipelines.list.queryOptions(),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const pipelineList: TPipeline[] = pipelines ?? [];

  return {
    pipelines: pipelineList,
    hasPipelines: pipelineList.length > 0,
    isLoading,
    isError,
    error,
    refetch,
  };
}
