import { Shield, KeyRound } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import { useProfileSidebar } from '../hooks';
import { cn } from '@/shared/lib';

export const ProfileSidebar = () => {
  const { displayName, jobTitle, isTwoFactorEnabled, isProActive, planLabel } =
    useProfileSidebar();

  return (
    <div className="border-border bg-card flex h-fit flex-col items-center rounded-xl border p-6 shadow-xs backdrop-blur-xs md:col-span-1">
      <ProfileAvatar />

      <h2 className="text-foreground mt-4 text-center text-lg font-semibold">{displayName}</h2>

      {jobTitle && (
        <p className="text-muted-foreground mt-0.5 text-center text-xs">{jobTitle}</p>
      )}

      <div className="bg-border/60 my-4 h-px w-full" />

      <div className="text-muted-foreground w-full space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <Shield
            className={cn(
              'h-3.5 w-3.5',
              isProActive ? 'text-emerald-500' : 'text-muted-foreground/80',
            )}
          />
          <span>
            Account Status:{' '}
            <strong
              className={cn(
                'font-medium',
                isProActive ? 'text-emerald-500' : 'text-muted-foreground',
              )}
            >
              {planLabel}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <KeyRound
            className={cn(
              'h-3.5 w-3.5',
              isTwoFactorEnabled ? 'text-emerald-500' : 'text-muted-foreground/80',
            )}
          />
          <span>
            Two-Factor Auth:{' '}
            {isTwoFactorEnabled ? (
              <strong className="font-medium text-emerald-500">Enabled</strong>
            ) : (
              <strong className="font-medium text-red-400">Disabled</strong>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};