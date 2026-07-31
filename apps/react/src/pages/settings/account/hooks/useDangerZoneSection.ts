import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTRPC } from '@/shared/api';
import { useLogout } from '@/shared/hooks';

export const useDangerZoneSection = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error'; message: string } | null>(null);

  const deleteAccountMutation = useMutation(
    trpc.users.remove.mutationOptions({
      onSuccess: () => {
        queryClient.clear();
        logout();
        navigate('/login', { replace: true });
      },
      onError: (error) => {
        setAlert({ type: 'error', message: error.message || 'Failed to delete account.' });
      },
    })
  );

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    confirm: () => {
      setAlert(null);
      deleteAccountMutation.mutate();
      setIsOpen(false);
    },
    isPending: deleteAccountMutation.isPending,
    alert,
  };
};