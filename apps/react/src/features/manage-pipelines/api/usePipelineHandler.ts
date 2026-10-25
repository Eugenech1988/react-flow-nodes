import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, trpcClient, useTRPC } from '@/shared/api';
import type { TCreatePipelineInputData, TUpdatePipelineInputData } from '@pipeline/contracts';
import type { TPipeline } from '@/entities';

interface UsePipelineHandlersOptions {
  onCreateSuccess?: () => void;
  onSetCurrentSuccess?: () => void;
  onUpdateSuccess?: () => void;
}

export const usePipelineHandler = (options?: UsePipelineHandlersOptions) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createPipeline = useMutation({
    mutationFn: async ({ data, file }: { data: TCreatePipelineInputData; file?: File }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (file) formData.append('file', file);
      return api.post('/pipelines', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
      options?.onCreateSuccess?.();
    },
  });

  const updatePipeline = useMutation({
    mutationFn: async (data: TUpdatePipelineInputData) => {
      if (!data.id) {
        throw new Error('Pipeline ID is required for update');
      }

      return trpcClient.pipelines.update.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
      options?.onUpdateSuccess?.();
    },
  });

  const deletePipeline = useMutation({
    mutationFn: (pipelineId: string) => trpcClient.pipelines.remove.mutate({ id: pipelineId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
    },
  });

  const setCurrentPipeline = useMutation({
    mutationFn: (pipeline: TPipeline) =>
      trpcClient.users.setCurrentPipeline.mutate({
        id: pipeline.id,
        name: pipeline.name,
        description: pipeline.description,
        status: pipeline.status,
        lastRunAt: pipeline.lastRunAt,
        lastRunStatus:
          pipeline.lastRunStatus === 'SUCCESS' ||
          pipeline.lastRunStatus === 'FAILED' ||
          pipeline.lastRunStatus === 'RUNNING'
            ? pipeline.lastRunStatus
            : null,
        screenshotUrl: pipeline.screenshotUrl,
      }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(trpc.auth.me.queryKey(), updatedUser);
      options?.onSetCurrentSuccess?.();
    },
  });

  return {
    createPipeline,
    deletePipeline,
    setCurrentPipeline,
    updatePipeline,
  };
};
