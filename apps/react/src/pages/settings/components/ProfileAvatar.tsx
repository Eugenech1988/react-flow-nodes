import React, { type RefObject } from 'react';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
  avatarPreview: string | null;
  initials: string;
  onAvatarClick: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BASE_URL = import.meta.env.API_URL || 'http://localhost:3000';

export const ProfileAvatar = ({
                                avatarPreview,
                                initials,
                                onAvatarClick,
                                fileInputRef,
                                onAvatarChange,
                              }: ProfileAvatarProps) => {
  const displaySrc = avatarPreview?.startsWith('blob:')
    ? avatarPreview
    : avatarPreview
      ? `${BASE_URL}${avatarPreview}`
      : null;

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onAvatarChange}
        accept="image/*"
        className="hidden"
      />
      <div
        onClick={onAvatarClick}
        className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden shadow-md border border-border bg-linear-to-br from-teal-400 to-emerald-500"
      >
        {displaySrc ? (
          <img
            src={displaySrc}
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
    </>
  );
};