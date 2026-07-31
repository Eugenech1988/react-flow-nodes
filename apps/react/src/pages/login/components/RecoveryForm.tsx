import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FloatingInput, LocalAlert, AppButton } from '@/shared/ui';
import {
  DEFAULT_TEXT_CLASSES,
  DEFAULT_LABEL_CLASSES,
  DEFAULT_FIELDSET_CLASSES,
  requestSchema,
  resetSchema,
  type TRecoveryMode,
  type TResetFormData,
  type TRequestFormData
} from '@/pages/login/model';

interface RecoveryFormProps {
  mode: TRecoveryMode;
  error?: string | null;
  isSuccess?: boolean;
  isLoading: boolean;
  onRequestSubmit: (data: TRequestFormData) => Promise<void>;
  onResetSubmit: (data: TResetFormData) => Promise<void>;
  onBack: () => void;
}

export const RecoveryForm: FC<RecoveryFormProps> = ({
                                                      mode,
                                                      error,
                                                      isSuccess,
                                                      isLoading,
                                                      onRequestSubmit,
                                                      onResetSubmit,
                                                      onBack,
                                                    }) => {
  const isRequest = mode === 'request';

  const requestForm = useForm<TRequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm<TResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (isSuccess && isRequest) {
    return (
      <div className="space-y-6">
        <LocalAlert
          hasSuccess
          hasError={false}
          alertMessage="Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
        />
        <AppButton
          variant="secondary"
          onClick={onBack}
          text="Return to login form"
          isDisabled={isLoading}
          className="w-full text-sm"
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={
        isRequest
          ? requestForm.handleSubmit(onRequestSubmit)
          : resetForm.handleSubmit(onResetSubmit)
      }
      className="space-y-6"
    >
      {error && <LocalAlert hasError hasSuccess={false} alertMessage={error} />}

      <div className="space-y-5">
        {isRequest ? (
          <FloatingInput
            {...requestForm.register('email')}
            type="email"
            autoComplete="email"
            label="Email Address"
            error={!!requestForm.formState.errors.email}
            errorMessage={requestForm.formState.errors.email?.message}
            labelClasses={DEFAULT_LABEL_CLASSES}
            fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
            className={DEFAULT_TEXT_CLASSES}
          />
        ) : (
          <>
            <FloatingInput
              {...resetForm.register('password')}
              type="password"
              autoComplete="new-password"
              label="New Password"
              error={!!resetForm.formState.errors.password}
              errorMessage={resetForm.formState.errors.password?.message}
              labelClasses={DEFAULT_LABEL_CLASSES}
              fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
              className={DEFAULT_TEXT_CLASSES}
            />

            <FloatingInput
              {...resetForm.register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              label="Confirm New Password"
              error={!!resetForm.formState.errors.confirmPassword}
              errorMessage={resetForm.formState.errors.confirmPassword?.message}
              labelClasses={DEFAULT_LABEL_CLASSES}
              fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
              className={DEFAULT_TEXT_CLASSES}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AppButton
          type="button"
          variant="secondary"
          onClick={onBack}
          isDisabled={isLoading}
          text="Cancel"
          className="w-full text-sm"
        />
        <AppButton
          type="submit"
          variant="primary"
          isPending={isLoading}
          isDisabled={isLoading}
          text={isRequest ? 'Send Link' : 'Update Password'}
          pendingText={isRequest ? 'Sending...' : 'Updating...'}
          icon={null}
          className="w-full text-sm"
        />
      </div>
    </form>
  );
};