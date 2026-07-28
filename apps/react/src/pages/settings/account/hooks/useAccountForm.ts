import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { useLogout, useUser } from '@/shared/hooks';
import { accountPasswordSchema, type TAccountFormData } from '../model';
import { useNavigate } from 'react-router-dom';

export const useAccountForm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const hasPassword = Boolean(user?.hasPassword);

  const form = useForm<TAccountFormData>({
    resolver: zodResolver(accountPasswordSchema(hasPassword)),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { formState: { isDirty }, reset } = form;

  const updatePasswordMutation = useMutation(
    trpc.users.updatePassword.mutationOptions({
      onSuccess: (data) => {
        if (data?.success) {
          queryClient.invalidateQueries(trpc.auth.me.queryFilter());
          reset({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setAlert({ type: 'success', message: 'Password updated successfully.' });
        }
      },
      onError: (error) => {
        console.error(error);
        setAlert({ type: 'error', message: error.message || 'Failed to update password.' });
      },
    })
  );

  const generate2faMutation = useMutation(
    trpc.auth.generate2fa.mutationOptions({
      onError: (error) => {
        console.error(error);
        setAlert({ type: 'error', message: error.message || 'Failed to generate 2FA secret.' });
      },
    })
  );

  const turnOn2faMutation = useMutation(
    trpc.auth.turnOn2fa.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.me.queryFilter());
        setAlert({ type: 'success', message: 'Two-factor authentication enabled.' });
      },
      onError: (error) => {
        console.error(error);
        setAlert({ type: 'error', message: error.message || 'Invalid code. Failed to enable 2FA.' });
      },
    })
  );

  const turnOff2faMutation = useMutation(
    trpc.auth.turnOff2fa.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.me.queryFilter());
        setAlert({ type: 'success', message: 'Two-factor authentication disabled.' });
      },
      onError: (error) => {
        console.error(error);
        setAlert({ type: 'error', message: error.message || 'Invalid code. Failed to disable 2FA.' });
      },
    })
  );

  const deleteAccountMutation = useMutation(
    trpc.users.remove.mutationOptions({
      onSuccess: () => {
        queryClient.clear();
        logout();
        navigate('/login', { replace: true });
      },
      onError: (error) => {
        console.error(error);
        setAlert({ type: 'error', message: error.message || 'Failed to delete account.' });
      },
    })
  );

  const onSubmit = (data: TAccountFormData) => {
    setAlert(null);

    updatePasswordMutation.mutate({
      currentPassword: data.currentPassword || '',
      newPassword: data.newPassword || '',
    });
  };

  const handleGenerate2faSecret = async () => {
    setAlert(null);
    return await generate2faMutation.mutateAsync();
  };

  const handleToggle2fa = async (value: boolean, code: string): Promise<string[] | void> => {
    setAlert(null);
    if (value) {
      const res = await turnOn2faMutation.mutateAsync({ code });
      return res?.recoveryCodes;
    } else {
      await turnOff2faMutation.mutateAsync({ code });
    }
  };

  const handleDeleteAccount = () => {
    setAlert(null);
    deleteAccountMutation.mutate();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    alert,
    isPristine: !isDirty,
    isPending: updatePasswordMutation.isPending,
    user2fa: user?.isTwoFactorEnabled ?? false,
    onGenerate2faSecret: handleGenerate2faSecret,
    onToggle2fa: handleToggle2fa,
    is2faPending: turnOn2faMutation.isPending || turnOff2faMutation.isPending,
    onDeleteAccount: handleDeleteAccount,
    isDeletePending: deleteAccountMutation.isPending,
  };
};