import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import type { TCreatePipelineInputData, TUpdatePipelineInputData } from '@pipeline/contracts';
import type { TPipeline } from '@/entities';
import { pipelineService } from './pipelineService';

interface UsePipelineHandlersOptions {
  onCreateSuccess?: () => void;
  onSetCurrentSuccess?: () => void;
  onSetCurrentError?: (error: Error) => void;
  onUpdateSuccess?: () => void;
}

const resolveLastRunStatus = (
  value: string | null | undefined,
): 'SUCCESS' | 'FAILED' | 'RUNNING' | null => {
  if (value === 'SUCCESS' || value === 'FAILED' || value === 'RUNNING') {
    return value;
  }
  return null;
};

export const usePipelineHandler = (options?: UsePipelineHandlersOptions) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createPipeline = useMutation({
    mutationFn: (payload: { data: TCreatePipelineInputData; file?: File }) =>
      pipelineService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
      options?.onCreateSuccess?.();
    },
  });

  const updatePipeline = useMutation({
    mutationFn: (data: TUpdatePipelineInputData) => pipelineService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
      options?.onUpdateSuccess?.();
    },
  });

  const deletePipeline = useMutation({
    mutationFn: (pipelineId: string) => pipelineService.remove(pipelineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
      queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
    },
  });

  const setCurrentPipeline = useMutation({
    mutationFn: (pipeline: TPipeline) =>
      pipelineService.setCurrent({
        id: pipeline.id,
        name: pipeline.name,
        description: pipeline.description,
        status: pipeline.status,
        lastRunAt: pipeline.lastRunAt,
        lastRunStatus: resolveLastRunStatus(pipeline.lastRunStatus),
        screenshotUrl: pipeline.screenshotUrl,
      }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(trpc.auth.me.queryKey(), updatedUser);
      options?.onSetCurrentSuccess?.();
    },
    onError: (error: Error) => {
      options?.onSetCurrentError?.(error);
    },
  });

  return {
    createPipeline,
    deletePipeline,
    setCurrentPipeline,
    updatePipeline,
  };
};
