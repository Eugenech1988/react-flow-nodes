import type { FC } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton, LocalAlert } from '@/shared/ui';
import { twoFactorLoginInputSchema, type TTwoFactorLoginInputData } from '@pipeline/contracts';
import { useAuthStore } from '../model';
import { AuthField } from './AuthField';

interface TwoFactorFormProps {
  error?: string | null;
  isLoading: boolean;
  onVerify: (data: TTwoFactorLoginInputData) => Promise<void>;
  onBack: () => void;
}

export const TwoFactorForm: FC<TwoFactorFormProps> = ({ error, isLoading, onVerify, onBack }) => {
  const { tempToken } = useAuthStore();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TTwoFactorLoginInputData>({
    resolver: zodResolver(twoFactorLoginInputSchema),
    defaultValues: { tempToken: tempToken || '', code: '' },
  });

  useEffect(() => {
    if (tempToken) setValue('tempToken', tempToken, { shouldValidate: true });
  }, [tempToken, setValue]);

  return (
    <form onSubmit={handleSubmit(onVerify)} className="space-y-6">
      <input type="hidden" {...register('tempToken')} />

      {error && <LocalAlert hasError hasSuccess={false} alertMessage={error} />}

      <AuthField
        id="code"
        type="text"
        inputMode="numeric"
        maxLength={32}
        autoFocus
        autoComplete="one-time-code"
        placeholder="123456 or recovery code"
        label="Verification Code"
        error={errors.code?.message}
        className="h-12 text-center font-mono text-xl font-bold tracking-widest"
        {...register('code')}
      />

      <div className="grid grid-cols-2 gap-3 pt-2">
        <AppButton type="button" text="Cancel" variant="secondary" size="md" onClick={onBack} isDisabled={isLoading} className="w-full rounded-md" />
        <AppButton type="submit" text="Verify" pendingText="Verifying..." variant="primary" size="md" isPending={isLoading} isDisabled={isLoading} className="w-full rounded-md bg-teal-600 hover:bg-teal-500" />
      </div>

      <p className="pt-2 text-center text-xs text-zinc-500">
        Lost access to your authenticator? <a href="mailto:support@pipeline.app?subject=2FA%20recovery" className="font-medium text-teal-400 hover:text-teal-300">Contact support</a>
      </p>
    </form>
  );
};