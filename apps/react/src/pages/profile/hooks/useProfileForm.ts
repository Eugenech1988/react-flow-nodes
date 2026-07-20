import { useState, useRef, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser, type User } from '@/features/auth';
import { api } from '@/shared/api';
import { profileSchema, type IProfileFormData } from '../types';

export const useProfileForm = () => {
  const { user, updateUserCache } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const form = useForm<IProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      email: user?.email || '',
      company: user?.profile?.company || '',
      location: user?.profile?.location || '',
      jobTitle: user?.profile?.jobTitle || '',
    },
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.profile?.avatarUrl || null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ type: 'error', message: 'File is too large. Maximum size is 5MB.' });
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: IProfileFormData) => {
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

    try {
      const response = await api.post<User>('/profile/update', dataToSend);
      if (response) {
        updateUserCache(response);
        setAlert({ type: 'success', message: 'Profile updated successfully.' });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Failed to update profile. Please try again.' });
    }
  };

  const watchedFirstName = form.watch('firstName');
  const watchedLastName = form.watch('lastName');
  const watchedJobTitle = form.watch('jobTitle');

  const initials = `${watchedFirstName[0] || ''}${watchedLastName[0] || ''}`.toUpperCase();

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
  };
};