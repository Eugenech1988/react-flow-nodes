import type { FC } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@pipeline/ui';
import { AppButton, LocalAlert } from '@/shared/ui';
import { twoFactorLoginInputSchema, type TTwoFactorLoginInputData } from '@pipeline/contracts';
import { useAuthStore } from '../model';
import { Link } from 'react-router-dom';

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

      <div className="space-y-1.5">
        <Input
          type="text"
          maxLength={32}
          autoFocus
          autoComplete="one-time-code"
          placeholder="123456 or recovery code"
          {...register('code')}
          className={`h-11 text-center font-mono text-2xl font-bold tracking-normal transition-all placeholder:tracking-normal focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none ${
            hasCodeError
              ? 'border-rose-500 bg-rose-500/5 text-rose-600 focus-visible:border-rose-500 focus-visible:ring-rose-500/30 dark:text-rose-400'
              : 'border-border bg-background text-foreground focus-visible:border-teal-500 focus-visible:ring-teal-500/30'
          }`}
        />
        {errors.code && (
          <p className="mt-1 text-center text-xs font-medium text-rose-600 dark:text-rose-400">
            {errors.code.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AppButton
          text="Cancel"
          variant="secondary"
          size="md"
          onClick={onBack}
          isDisabled={isLoading}
          className="w-full text-sm"
        />
        <AppButton
          type="submit"
          text="Verify"
          pendingText="Verifying..."
          variant="primary"
          size="md"
          isPending={isLoading}
          isDisabled={isLoading}
          className="w-full text-sm"
        />
      </div>

      <p className="pt-1 text-center text-xs text-zinc-600 dark:text-zinc-400">
        Lost access to your authenticator?{' '}
        <Link
          to="/support"
          className="font-medium text-teal-600 hover:underline focus:outline-none dark:text-teal-400"
        >
          Contact support
        </Link>
      </p>
    </form>
  );
};
