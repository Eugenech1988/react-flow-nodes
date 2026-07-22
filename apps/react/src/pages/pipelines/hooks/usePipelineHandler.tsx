import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { PIPELINES_QUERY_KEY } from '@/shared/lib';
import type { CreatePipelineDto } from '../types';

export const useCreatePipeline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data, file }: { userId: string; data: CreatePipelineDto; file?: File }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (file) formData.append('file', file);
      return api.post(`/pipelines/user/${userId}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PIPELINES_QUERY_KEY] });
    },
  });
};

export const useDeletePipeline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pipelineId: string) => {
      return api.delete(`/pipelines/${pipelineId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PIPELINES_QUERY_KEY] });
    },
  });
};