import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/features/auth';
import { api } from '@/shared/api';
import {
  Camera,
  Shield,
  KeyRound,
  Save,
  ArrowLeft
} from 'lucide-react';
import { FloatingInput } from '@/shared/ui/FloatingInput';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUserCache } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    company: user?.profile?.company || '',
    location: user?.profile?.location || '',
    jobTitle: user?.profile?.jobTitle || '' // Маппим jobTitle из базы в стейт role
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.profile?.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      const response = await api.post('/profile/update', dataToSend);

      if (response.data) {
        updateUserCache(response.data);
      }

      alert('Профиль и аватар успешно обновлены!');
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении данных.');
    }
  };

  const initials = `${formData.firstName[0] || ''}${formData.lastName[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-hidden"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to app
          </button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your account details, professional information, and security preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center p-6 border border-border bg-card rounded-xl shadow-xs h-fit">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={handleAvatarClick}
              className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden shadow-md border border-border bg-linear-to-br from-teal-400 to-emerald-500"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-4 text-center">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-xs text-muted-foreground text-center mt-0.5">{formData.jobTitle}</p>
            <div className="w-full h-[1px] bg-border/60 my-4" />

            <div className="w-full space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Account Status: <strong className="text-emerald-600 dark:text-emerald-400 font-medium">Pro Plan</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Two-Factor Auth: <strong className="text-foreground/80 font-normal">Enabled</strong></span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 border border-border bg-card rounded-xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-border/60 bg-foreground/[0.01]">
              <h3 className="font-medium text-sm">Personal Information</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

                <FloatingInput
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <FloatingInput
                label="Email Address"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  label="Company"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />

                <FloatingInput
                  label="Location"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <FloatingInput
                label="Job Title"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
              />

              <div className="flex justify-end pt-2 border-t border-border/60">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-lg cursor-pointer shadow-xs transition-colors outline-hidden focus:ring-2 focus:ring-teal-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};