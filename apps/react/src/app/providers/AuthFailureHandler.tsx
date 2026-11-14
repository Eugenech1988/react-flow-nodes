import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTRPC, onAuthFailure } from '@/shared/api';

export const AuthFailureHandler = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  useEffect(() => {
    return onAuthFailure(() => {
      queryClient.setQueryData(trpc.auth.me.queryKey(), null);
      queryClient.invalidateQueries({ queryKey: trpc.auth.me.queryKey() });
    });
  }, [queryClient, trpc]);

  return null;
};
