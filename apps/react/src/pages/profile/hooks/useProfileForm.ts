import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, type User } from '@/features/auth';
import { api } from '@/shared/api';
import type { IProfileFormData } from '../types';

export const useProfileForm = () => {
  const navigate = useNavigate();
  const { user, updateUserCache } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<IProfileFormData>({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    company: user?.profile?.company || '',
    location: user?.profile?.location || '',
    jobTitle: user?.profile?.jobTitle || ''
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.profile?.avatarUrl || null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Maximum size is 5MB.');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append('firstName', formData.firstName);
    dataToSend.append('lastName', formData.lastName);
    dataToSend.append('company', formData.company);
    dataToSend.append('location', formData.location);
    dataToSend.append('jobTitle', formData.jobTitle);
    if (avatarFile) {
      dataToSend.append('avatar', avatarFile);
    }

    try {
      const response = await api.post<User>('/profile/update', dataToSend);
      if (response) {
        updateUserCache(response);
      }

      alert('Профиль и аватар успешно обновлены!');
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении данных.');
    }
  };

  const initials = `${formData.firstName[0] || ''}${formData.lastName[0] || ''}`.toUpperCase();

  return {
    formData,
    avatarPreview,
    fileInputRef,
    handleChange,
    handleAvatarChange,
    handleAvatarClick,
    handleSubmit,
    initials,
    navigate,
  };
};