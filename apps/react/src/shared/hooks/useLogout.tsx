import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const navigate = useNavigate();

  const mutation = useMutation({
    ...trpc.auth.logout.mutationOptions(),
    onSettled: () => {
      queryClient.clear();

      navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

  return {
    logout: mutation.mutate,
    isLoggingOut: mutation.isPending,
  };
};
