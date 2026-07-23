import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { FloatingInput, LocalAlert } from '@/shared/ui';
import { Switch } from '@pipeline/ui';
import { SubmitButton, BackButton, DangerButton } from '@/shared/ui/buttons';
import { ShieldCheck, KeyRound } from 'lucide-react';
import type { IAccountFormData } from '../types';
import { DeleteAccountDialog } from './DeleteAccountDialog';

interface AccountFormProps {
  form: UseFormReturn<IAccountFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isPristine: boolean;
  isPending?: boolean;
  alert?: { type: 'success' | 'error'; message: string } | null;
  user2fa: boolean;
  onToggle2fa: (value: boolean) => void;
  is2faPending?: boolean;
  onDeleteAccount?: () => void;
  isDeletePending?: boolean;
  onGenerateBackupCodes?: () => void;
}

export const AccountForm = ({
                              form,
                              onSubmit,
                              isPristine,
                              isPending = false,
                              alert = null,
                              user2fa,
                              onToggle2fa,
                              is2faPending = false,
                              onDeleteAccount,
                              isDeletePending = false,
                              onGenerateBackupCodes
                            }: AccountFormProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    register,
    formState: {errors}
  } = form;

  const rootError = errors.root?.message || errors['' as keyof typeof errors]?.message;

  const hasError = alert?.type === 'error' || !!rootError;
  const hasSuccess = alert?.type === 'success';
  const alertMessage = alert?.message || (rootError as string);

  const handleBadgeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[role="switch"]')) {
      return;
    }

    if (is2faPending) return;
    onToggle2fa(!user2fa);
  };

  const handleConfirmDelete = () => {
    if (onDeleteAccount) {
      onDeleteAccount();
    }
    setIsDeleteDialogOpen(false);
  };

  const handleGenerateCodesClick = () => {
    if (onGenerateBackupCodes) {
      onGenerateBackupCodes();
    } else {
      console.log('generateCodesClick');
    }
  };

  return (
    <div className="border border-border bg-card rounded-xl shadow-xs overflow-hidden backdrop-blur-xs">
      <div className="px-6 py-4 border-b border-border/60 bg-muted/10">
        <h3 className="font-medium text-sm text-foreground/90">Security & Authentication</h3>
      </div>

      <div className="p-6 space-y-6">
        <LocalAlert
          hasSuccess={hasSuccess}
          hasError={hasError}
          alertMessage={alertMessage}
        />

        <div
          onClick={handleBadgeClick}
          className="group p-4 rounded-xl border border-border/60 bg-muted/5 hover:bg-muted/15 transition-colors flex items-center justify-between gap-4 cursor-pointer select-none"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 transition-transform group-hover:scale-105"/>
              <span className="text-sm font-medium text-foreground">
                Two-Factor Authentication (2FA)
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security to your account during login.
            </p>
          </div>

          <Switch
            checked={user2fa}
            onCheckedChange={onToggle2fa}
            disabled={is2faPending}
            style={{
              backgroundColor: user2fa ? 'var(--color-teal-600, #0d9488)' : undefined
            }}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-transparent"
          />
        </div>

        {user2fa && (
          <div
            className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 dark:bg-teal-950/20 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400"/>
                <span className="text-sm font-semibold text-foreground">
                  2FA Recovery Codes
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Generate backup codes to access your account if you lose your authentication device.
              </p>
            </div>

            <SubmitButton
              isPending={false}
              isDisabled={false}
              text="Get Codes"
              icon={KeyRound}
              onClick={handleGenerateCodesClick}
            />
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6 pt-4 border-t border-border/40">
          <div className="space-y-4">
            <FloatingInput
              {...register('currentPassword')}
              id="currentPassword"
              label="Current Password"
              type="password"
              autoComplete="current-password"
              error={!!errors.currentPassword}
              errorMessage={errors.currentPassword?.message}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingInput
                {...register('newPassword')}
                id="newPassword"
                label="New Password"
                type="password"
                autoComplete="new-password"
                error={!!errors.newPassword}
                errorMessage={errors.newPassword?.message}
              />
              <FloatingInput
                {...register('confirmPassword')}
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
              />
            </div>
          </div>

          <div className="flex justify-end items-center gap-2 pt-4 border-t border-border/60">
            <BackButton to="/" text="Back to app" />

            <SubmitButton
              isPending={isPending}
              isDisabled={isPristine}
              text="Change Password"
              pendingText="Saving..."
            />
          </div>
        </form>

        <div className="pt-4 border-t border-border/40 space-y-3">
          <h4 className="text-sm font-semibold tracking-wider text-rose-600">
            Danger Zone
          </h4>

          <div
            className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground">
                Delete Account
              </span>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated pipelines data.
              </p>
            </div>

            <DangerButton
              onClick={() => setIsDeleteDialogOpen(true)}
              isPending={isDeletePending}
              text="Delete Account"
              size="xs"
            />
          </div>
        </div>
      </div>

      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeletePending={isDeletePending}
      />
    </div>
  );
};