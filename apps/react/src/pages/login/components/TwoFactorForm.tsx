import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CancelButton, LocalAlert, SubmitButton } from '@/shared/ui';
import { twoFactorLoginInputSchema } from '@pipeline/contracts';
import { useAuthStore } from '@/pages/login/model';

type TTwoFactorLoginInputData = z.infer<typeof twoFactorLoginInputSchema>;

interface TwoFactorFormProps {
  qrCodeImage?: string;
  secretKey?: string;
  error?: string | null;
  isLoading: boolean;
  onVerify: (data: TTwoFactorLoginInputData, onSuccess: () => void) => Promise<void>;
  onBack: () => void;
  inputClasses?: string;
}

export const TwoFactorForm = ({
                                qrCodeImage,
                                secretKey,
                                error,
                                isLoading,
                                onVerify,
                                onBack,
                              }: TwoFactorFormProps) => {
  const { tempToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
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
    console.log(data);
    await onVerify(data, () => {
      reset();
    });
  };

  const hasCodeError = !!errors.code;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <input type="hidden" {...register('tempToken')} />

      {error && <LocalAlert hasError hasSuccess={false} alertMessage={error} />}

      {qrCodeImage && (
        <div className="flex flex-col items-center justify-center space-y-3">
          <img src={qrCodeImage} alt="2FA QR Code" className="w-40 h-40 rounded-lg border border-border" />
          {secretKey && (
            <p className="text-xs text-muted-foreground text-center">
              Secret: <span className="font-mono text-foreground">{secretKey}</span>
            </p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoFocus
          autoComplete="one-time-code"
          placeholder="123456"
          {...register('code')}
          className={`w-full px-3 py-2 border rounded-lg text-center tracking-[0.25em] text-xl font-mono focus:outline-none focus:ring-2 transition-all ${
            hasCodeError
              ? 'border-rose-500 bg-rose-500/5 text-rose-600 dark:text-rose-400 focus:ring-rose-500/50'
              : 'border-border bg-background text-foreground focus:ring-teal-500/50'
          }`}
        />
        {errors.code && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 text-center">
            {errors.code.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CancelButton
          type="button"
          onClick={onBack}
          isDisabled={isLoading}
          className="w-full"
        />
        <SubmitButton
          type="submit"
          isPending={isLoading}
          isDisabled={isLoading}
          text="Verify"
          pendingText="Verifying..."
          icon={null}
          className="w-full"
        />
      </div>
    </form>
  );
};