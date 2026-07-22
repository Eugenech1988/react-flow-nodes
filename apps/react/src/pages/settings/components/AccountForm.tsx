import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, ArrowLeft, Trash2, Loader2, ShieldCheck, KeyRound, AlertTriangle } from 'lucide-react';
import { type UseFormReturn } from 'react-hook-form';
import { FloatingInput, LocalAlert } from '@/shared/ui';
import {
  Button,
  Switch,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@pipeline/ui';
import type { IAccountFormData } from '../types';

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
                              onGenerateBackupCodes,
                            }: AccountFormProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    register,
    formState: { errors },
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
    onDeleteAccount();
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
          className="group p-4 rounded-lg border border-border/60 bg-muted/5 hover:bg-muted/15 transition-colors flex items-center justify-between gap-4 cursor-pointer select-none"
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
            onCheckedChange={onToggle2fa}
            disabled={is2faPending}
            style={{
              backgroundColor: user2fa ? 'var(--color-teal-600, #0d9488)' : undefined,
            }}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-transparent"
          />
        </div>

        {user2fa && (
          <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 dark:bg-teal-950/20 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-semibold text-foreground">
                  2FA Recovery Codes
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Generate backup codes to access your account if you lose your authentication device.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGenerateCodesClick}
              className="flex items-center gap-2 px-4 py-4.5 text-xs font-medium text-white bg-linear-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 active:from-teal-800 active:to-teal-700 rounded-lg cursor-pointer shadow-xs transition-all shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20"
            >
              <KeyRound className="w-3.5 h-3.5 text-white" />
              Get Codes
            </Button>
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
            <Link
              to="/"
              className="group flex items-center gap-2 px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to app
            </Link>

            <Button
              type="submit"
              disabled={isPristine || isPending}
              className="flex items-center gap-2 px-4 py-4.5 text-sm font-medium text-white bg-linear-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 active:from-teal-800 active:to-teal-700 rounded-lg cursor-pointer shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Change Password
            </Button>
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

            <Button
              type="button"
              disabled={isDeletePending}
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-4.5 text-xs font-medium text-white bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:from-rose-700 active:to-rose-600 rounded-lg cursor-pointer shadow-xs transition-all shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-rose-500/20 disabled:opacity-50"
            >
              {isDeletePending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 text-white" />
              )}
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border-border bg-card p-6 rounded-2xl shadow-lg backdrop-blur-md">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <DialogTitle className="text-lg font-semibold tracking-tight text-danger">
                Delete Account
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
              Are you sure you want to delete your account? This action cannot be undone and all your data, transactions, and pipelines will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-4.5 text-xs font-medium text-muted-foreground hover:text-foreground border-border/80 hover:bg-muted/50 rounded-lg cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeletePending}
              className="flex items-center justify-center gap-2 px-4 py-4.5 text-xs font-medium text-white bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:from-rose-700 active:to-rose-600 rounded-lg cursor-pointer shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-rose-500/20 disabled:opacity-50"
            >
              {isDeletePending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 text-white" />
              )}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};