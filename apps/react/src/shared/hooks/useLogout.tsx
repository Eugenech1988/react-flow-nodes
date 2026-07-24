import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const mutation = useMutation({
    ...trpc.auth.logout.mutationOptions(),
    onSuccess: () => {
      queryClient.setQueryData(trpc.auth.me.queryKey(), null);
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
