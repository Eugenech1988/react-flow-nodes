import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { useUser } from '@/shared/hooks';
import { PIPELINES_QUERY_KEY, type TPipeline } from '@/shared/lib';

export function usePipelines() {
  const { user } = useUser();
  const userId = user?.id;

  const {
    data: pipelines,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<TPipeline[] | null, Error>({
    queryKey: [PIPELINES_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        return await api.get<TPipeline[]>(`/pipelines/user/${userId}`);
      } catch (err: any) {
        if (err.message === 'Unauthorized') {
          return null;
        }
        throw err;
      }
    },
    enabled: Boolean(userId),
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