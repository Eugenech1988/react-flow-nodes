import { ArrowLeft, Save } from 'lucide-react';
import { FloatingInput, LocalAlert, AppButton } from '@/shared/ui';
import { usePasswordSection } from '../hooks';

export const PasswordSection = () => {
  const { form, onSubmit, hasPassword, isPending, isPristine, alert } = usePasswordSection();
  const { register, formState: { errors } } = form;

  const rootError = errors.root?.message;
  const hasError = alert?.type === 'error' || !!rootError;
  const hasSuccess = alert?.type === 'success';
  const alertMessage = alert?.message || rootError || '';

  return (
    <div className="border border-border bg-card rounded-xl shadow-xs p-6 space-y-6">
      <h3 className="font-medium text-sm text-foreground/90">
        {hasPassword ? 'Change Password' : 'Set Password'}
      </h3>

      <LocalAlert
        hasSuccess={hasSuccess}
        hasError={hasError}
        alertMessage={alertMessage}
      />

      <form onSubmit={onSubmit} className="space-y-4">
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

        <div className="flex justify-end items-center gap-2 pt-4 border-t border-border/60">
          <AppButton
            variant="ghost"
            isLink
            linkTo="/"
            icon={ArrowLeft}
            text="Back to app"
          />

          <AppButton
            type="submit"
            variant="primary"
            isPending={isPending}
            isDisabled={isPristine}
            text={hasPassword ? 'Change Password' : 'Set Password'}
            pendingText={hasPassword ? 'Saving...' : 'Setting Password...'}
            icon={Save}
          />
        </div>
      </form>
    </div>
  );
};