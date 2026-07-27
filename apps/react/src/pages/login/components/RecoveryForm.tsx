import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FloatingInput, LocalAlert, SubmitButton, CancelButton } from '@/shared/ui';
import {
  DEFAULT_TEXT_CLASSES,
  DEFAULT_LABEL_CLASSES,
  DEFAULT_FIELDSET_CLASSES
} from '@/pages/login/model';

export type RecoveryMode = 'request' | 'reset';

const requestSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RequestFormData = z.infer<typeof requestSchema>;
export type ResetFormData = z.infer<typeof resetSchema>;

type CombinedRecoveryData = RequestFormData & Partial<ResetFormData>;

interface RecoveryFormProps {
  mode: RecoveryMode;
  error?: string | null;
  isSuccess?: boolean;
  isLoading: boolean;
  onRequestSubmit: (data: RequestFormData) => Promise<void>;
  onResetSubmit: (data: ResetFormData) => Promise<void>;
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CombinedRecoveryData>({
    resolver: zodResolver(isRequest ? requestSchema : resetSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = async (data: CombinedRecoveryData) => {
    if (isRequest) {
      await onRequestSubmit({ email: data.email });
    } else {
      await onResetSubmit({
        password: data.password!,
        confirmPassword: data.confirmPassword!,
      });
    }
  };

  if (isSuccess && isRequest) {
    return (
      <div className="space-y-6">
        <LocalAlert
          hasSuccess
          hasError={false}
          alertMessage="Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
        />
        <CancelButton
          onClick={onBack}
          isDisabled={isLoading}
          className="w-full text-sm"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && <LocalAlert hasError hasSuccess={false} alertMessage={error} />}

      <div className="space-y-1">
        {isRequest ? (
          <FloatingInput
            {...register('email')}
            type="email"
            autoComplete="email"
            label="Email Address"
            error={!!errors.email}
            errorMessage={errors.email?.message}
            labelClasses={DEFAULT_LABEL_CLASSES}
            fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
            className={DEFAULT_TEXT_CLASSES}
          />
        ) : (
          <>
            <FloatingInput
              {...register('password')}
              type="password"
              autoComplete="new-password"
              label="New Password"
              error={!!errors.password}
              errorMessage={errors.password?.message}
              labelClasses={DEFAULT_LABEL_CLASSES}
              fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
              className={DEFAULT_TEXT_CLASSES}
            />

            <FloatingInput
              {...register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              label="Confirm New Password"
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              labelClasses={DEFAULT_LABEL_CLASSES}
              fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
              className={DEFAULT_TEXT_CLASSES}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CancelButton
          onClick={onBack}
          isDisabled={isLoading}
          className="w-full text-sm"
        />
        <SubmitButton
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