import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CancelButton, LocalAlert, SubmitButton } from '@/shared/ui';
import { twoFactorLoginInputSchema } from '@pipeline/contracts';

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
                                inputClasses
                              }: TwoFactorFormProps) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset
  } = useForm<TTwoFactorLoginInputData>({
    resolver: zodResolver(twoFactorLoginInputSchema),
    defaultValues: {
      code: ''
    }
  });

  const handleFormSubmit = async (data: TTwoFactorLoginInputData) => {
    await onVerify(data, () => {
      reset();
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && <LocalAlert hasError hasSuccess={false} alertMessage={error}/>}

      {qrCodeImage && (
        <div className="flex flex-col items-center justify-center space-y-3">
          <img src={qrCodeImage} alt="2FA QR Code" className="w-40 h-40 rounded-lg border border-border"/>
          {secretKey && (
            <p className="text-xs text-muted-foreground text-center">
              Secret: <span className="font-mono text-foreground">{secretKey}</span>
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="code" className="text-sm font-medium leading-none text-slate-700 dark:text-zinc-300">
          Authentication Code
        </label>
        <input
          {...register('code')}
          id="code"
          type="text"
          maxLength={6}
          placeholder="123456"
          className={inputClasses}
          disabled={isLoading}
        />
        {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CancelButton
          onClick={onBack}
          isDisabled={isLoading}
          className="w-full"
        />
        <SubmitButton
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