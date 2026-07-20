import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { accountSchema, type IAccountFormData } from '../types';

export const useAccountForm = () => {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);


  const form = useForm<IAccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      // twoFactorEnabled: false,
    },
  });

  const { formState: { isDirty } } = form;

  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: (payload: Pick<IAccountFormData, 'currentPassword' | 'newPassword'>) =>
      api.patch<{ success: boolean }>('/users/password', payload),
    onSuccess: (response) => {
      if (response?.success) {
        form.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          // twoFactorEnabled: false,
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

  const onSubmit = (data: IAccountFormData) => {
    setAlert(null);

    if (!data.currentPassword && !data.newPassword) {
      return;
    }

    updatePassword({
      currentPassword: data.currentPassword || '',
      newPassword: data.newPassword || '',
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    alert,
    isPristine: !isDirty,
    isPending
  };
};