import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTRPC } from '@/shared/api';

interface IDangerZoneAlert {
  type: 'error';
  message: string;
}

export const useDangerZoneSection = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState<IDangerZoneAlert | null>(null);

  const deleteAccountMutation = useMutation(
    trpc.users.remove.mutationOptions({
      onSuccess: () => {
        queryClient.clear();
        navigate('/login', { replace: true });
      },
      onError: (error) => {
        setAlert({
          type: 'error',
          message: error.message || 'Failed to delete account.',
        });
      },
    }),
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const confirm = () => {
    setAlert(null);
    deleteAccountMutation.mutate();
    setIsOpen(false);
  };

  return {
    isOpen,
    open,
    close,
    confirm,
    isPending: deleteAccountMutation.isPending,
    alert,
  };
};
