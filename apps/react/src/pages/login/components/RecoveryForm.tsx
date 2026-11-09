import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FloatingInput, LocalAlert, AppButton } from '@/shared/ui';
import {
  requestSchema,
  resetSchema,
  type TRecoveryMode,
  type TResetFormData,
  type TRequestFormData,
} from '../model';

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

  const labelClasses =
    'text-zinc-400 peer-focus:text-teal-400 peer-not-placeholder-shown:text-teal-400 [&]:peer-[:autofill]:text-teal-400 [&]:peer-[:autofill]:top-0 [&]:peer-[:autofill]:-translate-y-1/2 [&]:peer-[:autofill]:text-[10px]';
  const fieldsetClasses =
    'border-white/10 peer-focus:border-teal-500 peer-not-placeholder-shown:border-teal-500 peer-[:autofill]:border-teal-500';
  const inputClasses =
    'text-white [&:-webkit-autofill]:shadow-[inset_0_0_0_100px_#050505]! [&:-webkit-autofill]:[-webkit-text-fill-color:white]!';

  if (isSuccess && isRequest) {
    return (
      <div className="space-y-6">
        <LocalAlert
          hasSuccess
          hasError={false}
          alertMessage="Check your email for a link to reset your password."
        />
        <AppButton
          variant="secondary"
          onClick={onBack}
          text="Return to login form"
          isDisabled={isLoading}
          className="w-full rounded-md text-sm"
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

      <div className="space-y-4">
        {isRequest ? (
          <FloatingInput
            {...requestForm.register('email')}
            type="email"
            autoComplete="email"
            label="Email Address"
            error={!!requestForm.formState.errors.email}
            errorMessage={requestForm.formState.errors.email?.message}
            labelClasses={labelClasses}
            fieldsetClasses={fieldsetClasses}
            className={inputClasses}
            rounded="md"
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
              labelClasses={labelClasses}
              fieldsetClasses={fieldsetClasses}
              className={inputClasses}
              rounded="md"
            />
            <FloatingInput
              {...resetForm.register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              label="Confirm New Password"
              error={!!resetForm.formState.errors.confirmPassword}
              errorMessage={resetForm.formState.errors.confirmPassword?.message}
              labelClasses={labelClasses}
              fieldsetClasses={fieldsetClasses}
              className={inputClasses}
              rounded="md"
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
          className="w-full rounded-md text-sm"
        />
        <AppButton
          type="submit"
          variant="primary"
          isPending={isLoading}
          isDisabled={isLoading}
          text={isRequest ? 'Send Link' : 'Update Password'}
          pendingText={isRequest ? 'Sending...' : 'Updating...'}
          className="w-full rounded-md bg-teal-600 text-sm hover:bg-teal-500"
        />
      </div>
    </form>
  );
};
