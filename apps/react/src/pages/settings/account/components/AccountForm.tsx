import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { useUser } from '@/shared/hooks';
import { FloatingInput, LocalAlert } from '@/shared/ui';
import { Switch } from '@pipeline/ui';
import { BackButton, DangerButton, SubmitButton } from '@/shared/ui/buttons';
import { ShieldCheck } from 'lucide-react';
import type { TAccountFormData } from '@/pages/settings/account/lib';
import { DeleteAccountModal } from './DeleteAccountModal';
import { TwoFactorModal } from './TwoFactorModal';

interface AccountFormProps {
  form: UseFormReturn<TAccountFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isPristine: boolean;
  isPending?: boolean;
  alert?: { type: 'success' | 'error'; message: string } | null;
  user2fa: boolean;
  onToggle2fa: (value: boolean, code: string) => Promise<string[] | void> | void;
  onGenerate2faSecret: () => Promise<{ qrCodeImage: string; secret: string } | void>;
  is2faPending?: boolean;
  onDeleteAccount?: () => void;
  isDeletePending?: boolean;
}

export const AccountForm = ({
                              form,
                              onSubmit,
                              isPristine,
                              isPending = false,
                              alert = null,
                              user2fa,
                              onToggle2fa,
                              onGenerate2faSecret,
                              is2faPending = false,
                              onDeleteAccount,
                              isDeletePending = false,
                            }: AccountFormProps) => {
  const { user } = useUser();
  const hasPassword = Boolean(user?.hasPassword);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [is2faModalOpen, setIs2faModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'enable' | 'disable'>('enable');
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    formState: { errors },
  } = form;

  const rootError = errors.root?.message || errors['' as keyof typeof errors]?.message;
  const hasError = alert?.type === 'error' || !!rootError;
  const hasSuccess = alert?.type === 'success';
  const alertMessage = alert?.message || (rootError as string);

  const handleToggleClick = async () => {
    if (is2faPending || isGenerating) return;

    setModalError(null);

    if (!user2fa) {
      setModalMode('enable');
      setQrCodeImage(null);
      setIs2faModalOpen(true);
      setIsGenerating(true);

      try {
        if (onGenerate2faSecret) {
          const res = await onGenerate2faSecret();
          if (res && res.qrCodeImage) {
            setQrCodeImage(res.qrCodeImage);
          }
        }
      } catch (err: any) {
        setModalError(err?.message || 'Failed to generate 2FA secret');
      } finally {
        setIsGenerating(false);
      }
    } else {
      setModalMode('disable');
      setQrCodeImage(null);
      setIs2faModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIs2faModalOpen(false);
    setModalError(null);
  };

  const handleConfirm2fa = async (code: string) => {
    setModalError(null);
    try {
      if (modalMode === 'enable') {
        return await onToggle2fa(true, code);
      } else {
        await onToggle2fa(false, code);
        handleModalClose();
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Invalid verification code';

      setModalError(message);
      throw err;
    }
  };

  const handleConfirmDelete = () => {
    if (onDeleteAccount) {
      onDeleteAccount();
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="border border-border bg-card rounded-xl shadow-xs overflow-hidden backdrop-blur-xs">
      <div className="px-6 py-4 border-b border-border/60 bg-muted/10">
        <h3 className="font-medium text-sm text-foreground/90">
          Security & Authentication
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {!is2faModalOpen && (
          <LocalAlert
            hasSuccess={hasSuccess}
            hasError={hasError}
            alertMessage={alertMessage}
          />
        )}

        <div
          onClick={handleToggleClick}
          className="group p-4 rounded-xl border border-border/60 bg-muted/5 hover:bg-muted/15 transition-colors flex items-center justify-between gap-4 cursor-pointer select-none"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 transition-transform group-hover:scale-105" />
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
            onCheckedChange={() => {}}
            disabled={is2faPending || isGenerating}
            style={{
              backgroundColor: user2fa ? 'var(--color-teal-600, #0d9488)' : undefined,
            }}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-transparent pointer-events-none"
          />
        </div>

        <form onSubmit={onSubmit} className="space-y-6 pt-4 border-t border-border/40">
          <div className="space-y-4">
            {hasPassword ? (
              <>
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
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  You logged in via OAuth or don’t have a password set yet. Create a password to enable email login.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Используем те же поля newPassword и confirmPassword, чтобы данные уходили на бэкенд в том же формате */}
                  <FloatingInput
                    {...register('newPassword')}
                    id="newPassword"
                    label="Set Password"
                    type="password"
                    autoComplete="new-password"
                    error={!!errors.newPassword}
                    errorMessage={errors.newPassword?.message}
                  />
                  <FloatingInput
                    {...register('confirmPassword')}
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword?.message}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end items-center gap-2 pt-4 border-t border-border/60">
            <BackButton to="/" text="Back to app" />

            <SubmitButton
              isPending={isPending}
              isDisabled={isPristine}
              text={hasPassword ? 'Change Password' : 'Set Password'}
              pendingText={hasPassword ? 'Saving...' : 'Setting Password...'}
            />
          </div>
        </form>

        <div className="pt-4 border-t border-border/40 space-y-3">
          <h4 className="text-sm font-semibold tracking-wider text-rose-600">
            Danger Zone
          </h4>

          <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40 flex items-center justify-between gap-4">
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

      <TwoFactorModal
        isOpen={is2faModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirm2fa}
        mode={modalMode}
        qrCodeImage={qrCodeImage}
        modalError={modalError}
        isPending={is2faPending || isGenerating}
      />

      <DeleteAccountModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeletePending={isDeletePending}
      />
    </div>
  );
};