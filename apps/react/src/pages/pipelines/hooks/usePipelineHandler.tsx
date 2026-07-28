import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, trpcClient, useTRPC } from '@/shared/api';
import type { TCreatePipelineInputData, TUpdatePipelineInputData } from '@pipeline/contracts';
import type { TPipeline } from '@/shared/lib';

interface UsePipelineHandlersOptions {
  onCreateSuccess?: () => void;
  onSetCurrentSuccess?: () => void;
  onUpdateSuccess?: () => void;
}

export const usePipelineHandler = (options?: UsePipelineHandlersOptions) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createPipeline = useMutation({
    mutationFn: async ({ userId, data, file }: { userId: string; data: TCreatePipelineInputData; file?: File }) => {
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

  const updatePipeline = useMutation({
    mutationFn: async ({
                         data,
                         file,
                       }: {
      data: TUpdatePipelineInputData;
      file?: File;
    }) => {
      if (!data.id) {
        throw new Error('Pipeline ID is required for update');
      }

      if (file) {
        const formData = new FormData();
        formData.append('id', data.id);
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.status) formData.append('status', data.status);
        if (data.graphData) {
          formData.append('graphData', JSON.stringify(data.graphData));
        }
        formData.append('file', file);

        return api.patch(`/pipelines/${data.id}`, formData);
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
      queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
    },
  });

  const setCurrentPipeline = useMutation({
    mutationFn: (pipeline: TPipeline) => trpcClient.users.setCurrentPipeline.mutate(pipeline),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
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