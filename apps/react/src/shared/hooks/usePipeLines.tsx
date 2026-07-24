import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { useUser } from '@/shared/hooks';

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

  return {
    pipelines: pipelines ?? [],
    hasPipelines: Boolean(pipelines && pipelines.length > 0),
    isLoading,
    isError,
    error,
    refetch,
  };
}
