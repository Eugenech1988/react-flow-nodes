import { Shield, KeyRound } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';

interface ProfileSidebarProps {
  avatarPreview: string | null;
  initials: string;
  onAvatarClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  firstName: string;
  lastName: string;
  jobTitle: string;
  isTwoFactorEnabled?: boolean;
}

export const ProfileSidebar = ({
                                 avatarPreview,
                                 initials,
                                 onAvatarClick,
                                 fileInputRef,
                                 onAvatarChange,
                                 firstName,
                                 lastName,
                                 jobTitle,
                                 isTwoFactorEnabled,
                               }: ProfileSidebarProps) => {
  return (
    <div className="md:col-span-1 flex flex-col items-center p-6 border border-border bg-card rounded-xl shadow-xs h-fit backdrop-blur-xs">
      <ProfileAvatar
        avatarPreview={avatarPreview}
        initials={initials}
        onAvatarClick={onAvatarClick}
        fileInputRef={fileInputRef}
        onAvatarChange={onAvatarChange}
      />

      <h2 className="text-lg font-semibold mt-4 text-center text-foreground">
        {firstName} {lastName}
      </h2>
      <p className="text-xs text-muted-foreground text-center mt-0.5">{jobTitle}</p>
      <div className="w-full h-[1px] bg-border/60 my-4" />

      <div className="w-full space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            Account Status: <strong className="text-emerald-500 font-medium">Pro Plan</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <KeyRound className={`w-3.5 h-3.5 text-muted-foreground/80 ${isTwoFactorEnabled ? 'text-emerald-500' : ''}`} />
          <span>
            Two-Factor Auth:{' '}
            {isTwoFactorEnabled ?
            <strong className="text-emerald-500 font-medium">Enabled</strong>
              :
            <strong className="text-red-400 font-font-medium">Disabled</strong>
            }
          </span>
        </div>
      </div>
    </div>
  );
};