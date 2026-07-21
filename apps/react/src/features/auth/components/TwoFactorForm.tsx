import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LocalAlert } from '@/shared/ui';
const twoFactorSchema = z.object({
  code: z.string().min(6, 'The 2FA code must be at least 6 characters').max(6),
});

type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

interface TwoFactorFormProps {
  qrCodeImage?: string;
  secretKey?: string;
  error?: string | null;
  isLoading: boolean;
  onVerify: (data: TwoFactorFormData, onSuccess: () => void) => Promise<void>;
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
                                inputClasses,
                              }: TwoFactorFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleFormSubmit = async (data: TwoFactorFormData) => {
    await onVerify(data, () => {
      reset();
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

      <div className="space-y-2">
        <label htmlFor="code" className="text-sm font-medium leading-none">
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

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="w-full px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </form>
  );
};