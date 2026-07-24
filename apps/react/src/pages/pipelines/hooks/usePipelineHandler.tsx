import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, trpcClient, useTRPC } from '@/shared/api';
import type { CreatePipelineDto } from '@/pages/pipelines/types';

interface UseCreatePipelineOptions {
  onSuccess?: () => void;
}

export const useCreatePipeline = (options?: UseCreatePipelineOptions) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation({
    mutationFn: async ({ userId, data, file }: { userId: string; data: CreatePipelineDto; file?: File }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (file) formData.append('file', file);
      return api.post(`/pipelines/user/${userId}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
      options?.onSuccess?.();
    },
  });
};

export const useDeletePipeline = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation({
    mutationFn: (pipelineId: string) => trpcClient.pipelines.remove.mutate({ id: pipelineId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.pipelines.list.queryKey() });
    },
  });
};
