import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, trpcClient, useTRPC } from '@/shared/api';
import type { TCreatePipelineData } from '@/pages/pipelines/lib';

interface UsePipelineHandlersOptions {
  onCreateSuccess?: () => void;
  onSetCurrentSuccess?: () => void;
}

export const usePipelineHandler = (options?: UsePipelineHandlersOptions) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createPipeline = useMutation({
    mutationFn: async ({ userId, data, file }: { userId: string; data: TCreatePipelineData; file?: File }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (file) formData.append('file', file);
      return api.post(`/pipelines/user/${userId}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
      options?.onCreateSuccess?.();
    },
  });

  const deletePipeline = useMutation({
    mutationFn: (pipelineId: string) => trpcClient.pipelines.remove.mutate({ id: pipelineId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
    },
  });

  const setCurrentPipeline = useMutation({
    mutationFn: (pipeline: {
      id: string;
      name: string;
      description?: string | null;
      status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
      lastRunAt?: Date | null;
      lastRunStatus?: string | null;
      screenshotUrl?: string | null;
    }) => trpcClient.users.setCurrentPipeline.mutate(pipeline),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
      options?.onSetCurrentSuccess?.();
    },
  });

  return {
    createPipeline,
    deletePipeline,
    setCurrentPipeline,
  };
};