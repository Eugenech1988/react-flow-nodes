import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LocalAlert, AppButton } from '@/shared/ui';
import { requestSchema, resetSchema, type TRecoveryMode, type TResetFormData, type TRequestFormData } from '../model';
import { AuthField } from './AuthField';

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
                                                      mode, error, isSuccess, isLoading, onRequestSubmit, onResetSubmit, onBack,
                                                    }) => {
  const isRequest = mode === 'request';

  const requestForm = useForm<TRequestFormData>({ resolver: zodResolver(requestSchema), defaultValues: { email: '' } });
  const resetForm = useForm<TResetFormData>({ resolver: zodResolver(resetSchema), defaultValues: { password: '', confirmPassword: '' } });

  if (isSuccess && isRequest) {
    return (
      <div className="space-y-6">
        <LocalAlert hasSuccess hasError={false} alertMessage="Check your email for a link to reset your password." />
        <AppButton variant="secondary" onClick={onBack} text="Return to login form" isDisabled={isLoading} className="w-full text-sm rounded-md" />
      </div>
    );
  }

  return (
    <form
      onSubmit={isRequest ? requestForm.handleSubmit(onRequestSubmit) : resetForm.handleSubmit(onResetSubmit)}
      className="space-y-6"
    >
      {error && <LocalAlert hasError hasSuccess={false} alertMessage={error} />}

      <div className="space-y-4">
        {isRequest ? (
          <AuthField
            id="email"
            type="email"
            autoComplete="email"
            label="Email Address"
            error={requestForm.formState.errors.email?.message}
            {...requestForm.register('email')}
          />
        ) : (
          <>
            <AuthField
              id="password"
              type="password"
              autoComplete="new-password"
              label="New Password"
              error={resetForm.formState.errors.password?.message}
              {...resetForm.register('password')}
            />
            <AuthField
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              label="Confirm New Password"
              error={resetForm.formState.errors.confirmPassword?.message}
              {...resetForm.register('confirmPassword')}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AppButton type="button" variant="secondary" onClick={onBack} isDisabled={isLoading} text="Cancel" className="w-full text-sm rounded-md" />
        <AppButton
          type="submit"
          variant="primary"
          isPending={isLoading}
          isDisabled={isLoading}
          text={isRequest ? 'Send Link' : 'Update Password'}
          pendingText={isRequest ? 'Sending...' : 'Updating...'}
          className="w-full text-sm rounded-md bg-teal-600 hover:bg-teal-500"
        />
      </div>
    </form>
  );
};