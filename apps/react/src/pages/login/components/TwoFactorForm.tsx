import type { FC } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@pipeline/ui';
import { AppButton, LocalAlert } from '@/shared/ui';
import { twoFactorLoginInputSchema, type TTwoFactorLoginInputData } from '@pipeline/contracts';
import { useAuthStore } from '../model';
import { cn } from '@/shared/lib';

interface TwoFactorFormProps {
  error?: string | null;
  isLoading: boolean;
  onVerify: (data: TTwoFactorLoginInputData) => Promise<void>;
  onBack: () => void;
}

export const TwoFactorForm: FC<TwoFactorFormProps> = ({ error, isLoading, onVerify, onBack }) => {
  const { tempToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TTwoFactorLoginInputData>({
    resolver: zodResolver(twoFactorLoginInputSchema),
    defaultValues: {
      tempToken: tempToken || '',
      code: '',
    },
  });

  useEffect(() => {
    if (tempToken) {
      setValue('tempToken', tempToken, { shouldValidate: true });
    }
  }, [tempToken, setValue]);

  const handleFormSubmit = async (data: TTwoFactorLoginInputData) => {
    await onVerify(data);
  };

  const hasCodeError = !!errors.code;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <input type="hidden" {...register('tempToken')} />

      {error && <LocalAlert hasError hasSuccess={false} alertMessage={error} />}

      <div className="space-y-2">
        {/* Темный инпут с бирюзовым фокусом и моноширинным шрифтом */}
        <Input
          type="text"
          inputMode="numeric"
          maxLength={32}
          autoFocus
          autoComplete="one-time-code"
          placeholder="123456 or recovery code"
          {...register('code')}
          className={cn(
            'h-12 w-full rounded-lg border bg-white/5 text-center font-mono text-xl font-bold tracking-widest text-white placeholder:text-zinc-600 placeholder:tracking-normal focus-visible:outline-none focus-visible:ring-1',
            hasCodeError
              ? 'border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/50'
              : 'border-white/10 focus-visible:border-teal-500 focus-visible:ring-teal-500/50',
          )}
        />
        {errors.code && (
          <p className="text-center text-xs font-medium text-rose-400">
            {errors.code.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <AppButton
          type="button"
          text="Cancel"
          variant="secondary"
          size="md"
          onClick={onBack}
          isDisabled={isLoading}
          className="w-full border-white/10 bg-white/5 text-sm text-zinc-300 hover:bg-white/10 hover:text-white"
        />
        <AppButton
          type="submit"
          text="Verify"
          pendingText="Verifying..."
          variant="primary"
          size="md"
          isPending={isLoading}
          isDisabled={isLoading}
          className="w-full bg-teal-600 text-sm hover:bg-teal-500"
        />
      </div>

      <p className="pt-2 text-center text-xs text-zinc-500">
        Lost access to your authenticator?{' '}
        <a
          href="mailto:support@pipeline.app?subject=2FA%20recovery"
          className="font-medium text-teal-400 transition-colors hover:text-teal-300 focus:outline-none"
        >
          Contact support
        </a>
      </p>
    </form>
  );
};