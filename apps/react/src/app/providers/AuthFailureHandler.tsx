import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTRPC, onAuthFailure } from '@/shared/api';
import { useStore } from '@/entities';

export const AuthFailureHandler = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  useEffect(() => {
    return onAuthFailure(() => {
      queryClient.setQueryData(trpc.auth.me.queryKey(), null);
      useStore.persist.clearStorage();
      useStore.getState().resetGraph();
    });
  }, [queryClient, trpc]);

  return null;
};