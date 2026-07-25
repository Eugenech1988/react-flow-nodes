import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { useLogout, useUser } from '@/shared/hooks';
import { accountSchema, type IAccountFormData } from '@/pages/settings/types';
import { useNavigate } from 'react-router-dom';

export const useAccountForm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const form = useForm<IAccountFormData>({
    resolver: zodResolver(accountSchema),
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

  const onSubmit = (data: IAccountFormData) => {
    setAlert(null);

    updatePasswordMutation.mutate({
      currentPassword: data.currentPassword || '',
      newPassword: data.newPassword || '',
    });
  };

  // Метод для генерации секрета (вызывается из AccountForm)
  const handleGenerate2faSecret = async () => {
    setAlert(null);
    return await generate2faMutation.mutateAsync();
  };

  // Единая функция переключения 2FA
  const handleToggle2fa = (value: boolean, code: string) => {
    setAlert(null);
    if (value) {
      turnOn2faMutation.mutate({ code });
    } else {
      turnOff2faMutation.mutate({ code });
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
    onGenerate2faSecret: handleGenerate2faSecret, // <-- Добавлен в возврат
    onToggle2fa: handleToggle2fa,
    is2faPending: turnOn2faMutation.isPending || turnOff2faMutation.isPending,
    onDeleteAccount: handleDeleteAccount,
    isDeletePending: deleteAccountMutation.isPending,
  };
};