import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { USER_QUERY_KEY } from '@/shared/lib';

export const useLogout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await api.post<{ success: boolean }>('/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(USER_QUERY_KEY, null);

    },
    onError: (error) => {
      console.error('Logout failed:', error);
    }
  });

  return {
    logout: mutation.mutate,
    isLoggingOut: mutation.isPending,
  };
}