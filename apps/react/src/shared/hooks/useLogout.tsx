import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTRPC } from '@/shared/api';
import { useStore } from '@/entities';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const navigate = useNavigate();

  const mutation = useMutation({
    ...trpc.auth.logout.mutationOptions(),
    onSuccess: () => {
      queryClient.clear();
      useStore.persist.clearStorage();
      useStore.getState().resetGraph();
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || 'Logout failed. Please try again or close the browser.');
    },
  });

  return {
    logout: mutation.mutate,
    isLoggingOut: mutation.isPending,
  };
};