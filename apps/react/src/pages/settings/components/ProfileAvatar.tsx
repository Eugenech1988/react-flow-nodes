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
  const displaySrc = avatarPreview
    ? avatarPreview.startsWith('http') || avatarPreview.startsWith('blob:')
      ? avatarPreview
      : `${BASE_URL}${avatarPreview}`
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
        className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden shadow-xs border border-teal-500/30 bg-linear-to-br from-teal-500 to-teal-700 transition-transform active:scale-95"
      >
        {displaySrc ? (
          <img
            src={displaySrc}
            alt="Avatar Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white tracking-wider">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-teal-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Camera className="w-6 h-6 text-white drop-shadow-xs" />
        </div>
      </div>
    </>
  );
};