import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient, useTRPC } from '@/shared/api';
import type { TCreateExecutionInputData, TUpdateExecutionInputData } from '@pipeline/contracts';

interface UseExecutionsHandlersOptions {
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export const useExecutionsHandler = (
  // params?: { pipelineId?: string },
  options?: UseExecutionsHandlersOptions
) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createExecution = useMutation({
    mutationFn: (data: TCreateExecutionInputData) =>
      trpcClient.executions.create.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.executions.list.queryKey() });
      options?.onCreateSuccess?.();
    },
  });

  const updateExecution = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUpdateExecutionInputData }) =>
      trpcClient.executions.update.mutate({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: trpc.executions.list.queryKey() });
      queryClient.invalidateQueries({
        queryKey: trpc.executions.getById.queryKey({ id: variables.id }),
      });
      options?.onUpdateSuccess?.();
    },
  });

  const deleteExecution = useMutation({
    mutationFn: (executionId: string) =>
      trpcClient.executions.remove.mutate({ id: executionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.executions.list.queryKey() });
      options?.onDeleteSuccess?.();
    },
  });

  return {
    createExecution,
    updateExecution,
    deleteExecution,
  };
};