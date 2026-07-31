import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { useUser } from '@/shared/hooks';
import { accountPasswordSchema, type TAccountFormData } from '../model';

export const usePasswordSection = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { user } = useUser();
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
          reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setAlert({ type: 'success', message: 'Password updated successfully.' });
        }
      },
      onError: (error) => {
        setAlert({ type: 'error', message: error.message || 'Failed to update password.' });
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

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    hasPassword,
    isPristine: !isDirty,
    isPending: updatePasswordMutation.isPending,
    alert,
  };
};