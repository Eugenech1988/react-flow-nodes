import { useState, useRef, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type TProfile, USER_QUERY_KEY } from '@/shared/lib';
import { useUser } from '@/shared/hooks';
import { api } from '@/shared/api';
import { profileSchema, type IProfileFormData } from '../types';

export const useProfileForm = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const form = useForm<IProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onSubmit',
    reValidateMode: "onChange",
    values: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      email: user?.email || '',
      company: user?.profile?.company || '',
      location: user?.profile?.location || '',
      jobTitle: user?.profile?.jobTitle || ''
    },
    resetOptions: {
      keepDirty: true
    }
  });

  const {formState: {isDirty}} = form;
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.profile?.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {mutate: updateProfile, isPending} = useMutation({
    mutationFn: (dataToSend: FormData) => api.patch<TProfile>('/profile', dataToSend),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: USER_QUERY_KEY});
      form.reset(form.getValues());
      setAvatarFile(null);
      setAlert({type: 'success', message: 'Profile updated successfully.'});
    },
    onError: (error) => {
      console.error(error);
      setAlert({type: 'error', message: 'Failed to update profile. Please try again.'});
    }
  });

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlert({type: 'error', message: 'File is too large. Maximum size is 5MB.'});
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: IProfileFormData) => {
    setAlert(null);
    const dataToSend = new FormData();
    dataToSend.append('firstName', data.firstName);
    dataToSend.append('lastName', data.lastName);
    dataToSend.append('company', data.company || '');
    dataToSend.append('location', data.location || '');
    dataToSend.append('jobTitle', data.jobTitle || '');
    if (avatarFile) {
      dataToSend.append('avatar', avatarFile);
    }

    updateProfile(dataToSend);
  };

  const watchedFirstName = form.watch('firstName');
  const watchedLastName = form.watch('lastName');
  const watchedJobTitle = form.watch('jobTitle');

  const initials = `${watchedFirstName[0] || ''}${watchedLastName[0] || ''}`.toUpperCase();
  const isPristine = !isDirty && !avatarFile;

  return {
    form,
    avatarPreview,
    fileInputRef,
    handleAvatarChange,
    handleAvatarClick,
    onSubmit: form.handleSubmit(onSubmit),
    initials,
    firstName: watchedFirstName,
    lastName: watchedLastName,
    jobTitle: watchedJobTitle,
    alert,
    isPristine,
    isPending
  };
};