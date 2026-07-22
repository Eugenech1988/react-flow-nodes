import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { USER_QUERY_KEY } from '@/shared/lib';
import { useUser } from '@/shared/hooks';
import { accountSchema, type IAccountFormData } from '../types';

export const useAccountForm = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
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

  const { mutate: updatePassword, isPending: isPasswordPending } = useMutation({
    mutationFn: (payload: Pick<IAccountFormData, 'currentPassword' | 'newPassword'>) =>
      api.patch<{ success: boolean }>('/users/password', payload),
    onSuccess: (response) => {
      if (response?.success) {
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password.';
      setAlert({ type: 'error', message: errorMessage });
    },
  });

  const { mutate: toggle2fa, isPending: is2faPending } = useMutation({
    mutationFn: (user2fa: boolean) =>
      api.patch<{ success: boolean }>('/users/2fa', { user2fa }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
    onError: (error) => {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update 2FA status.';
      setAlert({ type: 'error', message: errorMessage });
    },
  });

  const onSubmit = (data: IAccountFormData) => {
    setAlert(null);

    updatePassword({
      currentPassword: data.currentPassword || '',
      newPassword: data.newPassword || '',
    });
  };

  const handleToggle2fa = (value: boolean) => {
    setAlert(null);
    toggle2fa(value);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    alert,
    isPristine: !isDirty,
    isPending: isPasswordPending,
    user2fa: user?.isTwoFactorEnabled ?? false,
    onToggle2fa: handleToggle2fa,
    is2faPending,
  };
};