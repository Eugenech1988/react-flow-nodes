import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser, type User } from '@/features/auth';
import { api } from '@/shared/api';
import { accountSchema, type IAccountFormData } from '../types';

export const useAccountForm = () => {
  const { user, updateUserCache } = useUser();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const form = useForm<IAccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: user?.account?.twoFactorEnabled || false,
    },
  });

  const { formState: { isDirty } } = form;

  const onSubmit = async (data: IAccountFormData) => {
    setAlert(null);
    try {
      const response = await api.post<User>('/account/update', {
        currentPassword: data.currentPassword || undefined,
        newPassword: data.newPassword || undefined,
        twoFactorEnabled: data.twoFactorEnabled,
      });

      if (response) {
        updateUserCache(response);
        form.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          twoFactorEnabled: response.account?.twoFactorEnabled || false,
        });
        setAlert({ type: 'success', message: 'Account settings updated successfully.' });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Failed to update account settings.' });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    alert,
    isPristine: !isDirty,
  };
};