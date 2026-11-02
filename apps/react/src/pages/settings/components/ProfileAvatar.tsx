import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { useProfileSidebar } from '../hooks';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ProfileAvatar = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { avatarUrl, initials } = useProfileSidebar();

  const uploadAvatarMutation = useMutation(
    trpc.profile.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.me.queryFilter());
      },
    }),
  );

  const handleContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }

    try {
      const base64Avatar = await fileToBase64(file);
      await uploadAvatarMutation.mutateAsync({ avatarUrl: base64Avatar });
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div
        onClick={handleContainerClick}
        className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-teal-500/30 bg-gradient-to-br from-teal-500 to-teal-700 shadow-xs transition-transform active:scale-95"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar Preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-bold tracking-wider text-white">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-teal-950/50 opacity-0 backdrop-blur-[2px] transition-all duration-200 group-hover:opacity-100">
          <Camera className="h-6 w-6 text-white drop-shadow-xs" />
        </div>
      </div>
    </>
  );
};
