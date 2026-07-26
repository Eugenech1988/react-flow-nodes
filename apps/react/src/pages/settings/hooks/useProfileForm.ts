import { useRef, useEffect, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { useUser } from '@/shared/hooks';
import { profileSchema, type IProfileFormData } from '@/pages/settings/types';
import { useProfileStore } from '../model';

export const useProfileForm = () => {
  const trpc = useTRPC();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    alert,
    avatarPreview,
    isAvatarUploading,
    isPending,
    setAlert,
    setAvatarPreview,
    updateProfile,
    uploadAvatar,
  } = useProfileStore();

  useEffect(() => {
    if (user?.profile?.avatarUrl && !avatarPreview) {
      setAvatarPreview(user.profile.avatarUrl);
    }
  }, [user?.profile?.avatarUrl, avatarPreview, setAvatarPreview]);

  const form = useForm<IProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    values: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      email: user?.email || '',
      company: user?.profile?.company || '',
      location: user?.profile?.location || '',
      jobTitle: user?.profile?.jobTitle || '',
    },
    resetOptions: {
      keepDirty: true,
    },
  });

  const { formState: { isDirty } } = form;

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadAvatar(file, form.getValues(), async () => {
      await queryClient.invalidateQueries(trpc.auth.me.queryFilter());
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: IProfileFormData) => {
    setAlert(null);
    await updateProfile(data, async () => {
      await queryClient.invalidateQueries(trpc.auth.me.queryFilter());
      form.reset(form.getValues());
    });
  };

  const watchedFirstName = form.watch('firstName') ?? '';
  const watchedLastName = form.watch('lastName') ?? '';
  const watchedJobTitle = form.watch('jobTitle') ?? '';

  const initials = `${watchedFirstName[0] || ''}${watchedLastName[0] || ''}`.toUpperCase();

  return {
    form,
    avatarPreview: avatarPreview || user?.profile?.avatarUrl || null,
    fileInputRef,
    handleAvatarChange,
    handleAvatarClick,
    onSubmit: form.handleSubmit(onSubmit),
    initials,
    firstName: watchedFirstName,
    lastName: watchedLastName,
    jobTitle: watchedJobTitle,
    alert,
    isPristine: !isDirty,
    isPending: isPending || isAvatarUploading,
  };
};