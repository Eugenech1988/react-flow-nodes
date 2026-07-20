import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@pipeline/ui';
import { cn } from '@/shared/lib';
import { twoFactorSchema, type TwoFactorFormData } from '../hooks/useTwoFactorAuth';

interface TwoFactorFormProps {
  qrCodeImage: string | null;
  secretKey: string | null;
  error: string | null;
  isLoading: boolean;
  onVerify: (data: TwoFactorFormData) => Promise<void>;
  onBack: () => void;
  inputClasses: string;
}

export const TwoFactorForm: React.FC<TwoFactorFormProps> = ({
                                                              qrCodeImage,
                                                              secretKey,
                                                              error,
                                                              isLoading,
                                                              onVerify,
                                                              onBack,
                                                              inputClasses,
                                                            }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: '',
    },
  });

  const fieldError = errors.code?.message;

  return (
    <form onSubmit={handleSubmit(onVerify)} className="space-y-6 pt-2">
      {error && (
        <div className="text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/40 p-3 rounded-xl text-center antialiased">
          {error}
        </div>
      )}

      {qrCodeImage && (
        <div className="flex flex-col items-center justify-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-3">
          <p className="text-xs text-zinc-400 text-center">
            Scan this QR code with Google Authenticator:
          </p>
          <img src={qrCodeImage} alt="2FA QR Code" className="w-40 h-40 bg-white p-2 rounded-lg" />
          {secretKey && (
            <p className="text-[11px] text-zinc-500 break-all text-center">
              Secret: <span className="text-zinc-300 font-mono">{secretKey}</span>
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <input
          type="text"
          placeholder="123456"
          maxLength={6}
          autoFocus
          className={cn(
            inputClasses,
            'h-12 px-4 rounded-xl border border-zinc-800 text-center text-xl tracking-[0.5em] font-mono',
            fieldError && 'border-red-500/50'
          )}
          {...register('code')}
        />
        {fieldError && (
          <p className="text-xs text-red-400 text-center font-medium">{fieldError}</p>
        )}
      </div>

      <div className="pt-2 flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="cursor-pointer w-1/3 h-12 rounded-xl border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer w-2/3 h-12 rounded-xl bg-teal-600 text-base font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-500 hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] active:scale-[0.98]"
        >
          {isLoading ? 'Verifying...' : 'Confirm'}
        </Button>
      </div>
    </form>
  );
};