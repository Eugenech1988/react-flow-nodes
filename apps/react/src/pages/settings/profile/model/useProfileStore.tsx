import { create } from 'zustand';
import { trpcClient } from '@/shared/api';
import { type TUpdateProfileInputData } from '@pipeline/contracts';

type TProfileAlert = { type: 'success' | 'error'; message: string } | null;

interface TProfileState {
  alert: TProfileAlert;
  avatarPreview: string | null;
  isAvatarUploading: boolean;
  isPending: boolean;

  setAlert: (alert: TProfileAlert) => void;
  setAvatarPreview: (preview: string | null) => void;
  resetState: () => void;

  updateProfile: (data: TUpdateProfileInputData, onSuccess?: () => Promise<void> | void) => Promise<void>;
  uploadAvatar: (file: File, formValues: TUpdateProfileInputData, onSuccess?: () => Promise<void> | void) => Promise<void>;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const useProfileStore = create<TProfileState>((set) => ({
  alert: null,
  avatarPreview: null,
  isAvatarUploading: false,
  isPending: false,

  setAlert: (alert) => set({ alert }),
  setAvatarPreview: (avatarPreview) => set({ avatarPreview }),
  resetState: () => set({ alert: null, avatarPreview: null, isAvatarUploading: false, isPending: false }),

  updateProfile: async (data, onSuccess) => {
    set({ isPending: true, alert: null });
    try {
      await trpcClient.profile.update.mutate({
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company || '',
        location: data.location || '',
        jobTitle: data.jobTitle || '',
      });

      set({ alert: { type: 'success', message: 'Profile updated successfully.' } });

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
      set({ alert: { type: 'error', message } });
    } finally {
      set({ isPending: false });
    }
  },

  uploadAvatar: async (file, formValues, onSuccess) => {
    if (file.size > 5 * 1024 * 1024) {
      set({ alert: { type: 'error', message: 'File is too large. Maximum size is 5MB.' } });
      return;
    }

    const tempPreviewUrl = URL.createObjectURL(file);
    set({
      avatarPreview: tempPreviewUrl,
      isAvatarUploading: true,
      alert: null,
    });

    try {
      const base64Avatar = await fileToBase64(file);

      const response = await trpcClient.profile.update.mutate({
        firstName: formValues.firstName || '',
        lastName: formValues.lastName || '',
        company: formValues.company || '',
        location: formValues.location || '',
        jobTitle: formValues.jobTitle || '',
        avatarUrl: base64Avatar,
      });

      const newAvatarUrl = response.profile?.avatarUrl;
      set({ avatarPreview: newAvatarUrl });

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload avatar.';
      set({
        alert: { type: 'error', message },
      });
    } finally {
      set({ isAvatarUploading: false });
    }
  },
}));