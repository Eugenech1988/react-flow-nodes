import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { PIPELINES_QUERY_KEY, type TPipeline } from '@/shared/lib';

export function usePipelines() {
  const {
    data: pipelines,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<TPipeline[] | null, Error>({
    queryKey: PIPELINES_QUERY_KEY,
    queryFn: async () => {
      try {
        return await api.get<TPipeline[]>('/pipelines');
      } catch (err: any) {
        if (err.message === 'Unauthorized') {
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error.message === 'Unauthorized') return false;
      return failureCount < 2;
    },
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