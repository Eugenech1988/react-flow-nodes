import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { useUser } from '@/shared/hooks';
import type { AlertState } from '@/shared/lib';
import { updateProfileInputSchema, type TUpdateProfileInputData } from '@pipeline/contracts';

export const useProfileForm = () => {
  const trpc = useTRPC();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [alert, setAlert] = useState<AlertState>(null);

  const form = useForm<TUpdateProfileInputData>({
    resolver: zodResolver(updateProfileInputSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    values: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      company: user?.profile?.company || '',
      location: user?.profile?.location || '',
      jobTitle: user?.profile?.jobTitle || '',
    },
    resetOptions: {
      keepDirty: true,
    },
  });

  const { formState: { isDirty } } = form;

  const updateProfileMutation = useMutation(
    trpc.profile.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.me.queryFilter());
        setAlert({ type: 'success', message: 'Profile updated successfully.' });
        form.reset(form.getValues());
      },
      onError: (error) => {
        setAlert({
          type: 'error',
          message: error.message || 'Failed to update profile. Please try again.',
        });
      },
    })
  );

  const onSubmit = async (data: TUpdateProfileInputData) => {
    setAlert(null);
    await updateProfileMutation.mutateAsync({
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company || '',
      location: data.location || '',
      jobTitle: data.jobTitle || '',
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    alert,
    isPristine: !isDirty,
    isPending: updateProfileMutation.isPending,
  };
};