import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@pipeline/ui';
import { DialogHeader, DialogBody, DialogFooter } from '@/shared/ui';

const twoFactorCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

type ITwoFactorFormData = z.infer<typeof twoFactorCodeSchema>;

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string) => void;
  mode: 'enable' | 'disable';
  qrCodeImage?: string | null;
  modalError?: string | null;
  isPending?: boolean;
}

export const TwoFactorModal = ({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 mode,
                                 qrCodeImage,
                                 modalError,
                                 isPending = false,
                               }: TwoFactorModalProps) => {
  const isEnable = mode === 'enable';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ITwoFactorFormData>({
    resolver: zodResolver(twoFactorCodeSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
    },
  });

  // Сбрасываем форму каждый раз при открытии/закрытии модалки
  useEffect(() => {
    if (isOpen) {
      reset({ code: '' });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: ITwoFactorFormData) => {
    onConfirm(data.code);
  };

  const handleClose = () => {
    reset({ code: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border-border bg-card p-0 gap-0 overflow-hidden rounded-xl shadow-lg backdrop-blur-md"
      >
        <DialogHeader
          title={isEnable ? 'Enable 2FA' : 'Disable 2FA'}
          icon={<ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogBody withBorder className="space-y-4">
            {modalError && (
              <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-xs font-medium text-rose-600 dark:text-rose-400">
                {modalError}
              </div>
            )}

            {isEnable && (
              <div className="space-y-2 text-center">
                <p className="text-xs text-muted-foreground text-left">
                  1. Scan this QR code with your Authenticator app (Google Authenticator, Authy):
                </p>
                {qrCodeImage ? (
                  <div className="flex justify-center bg-white p-2 rounded-lg border inline-block mx-auto shadow-xs">
                    <img src={qrCodeImage} alt="2FA QR Code" className="w-40 h-40" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 text-xs text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border/60">
                    <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                    <span>Generating QR code...</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {isEnable
                  ? '2. Enter the 6-digit code from your app to confirm:'
                  : 'Enter a valid 6-digit code from your app to disable 2FA:'}
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                autoComplete="one-time-code"
                placeholder="123456"
                {...register('code')}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-center tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
              {errors.code && (
                <p className="text-xs text-rose-600 mt-1">{errors.code.message}</p>
              )}
            </div>
          </DialogBody>

          <DialogFooter
            onCancel={handleClose}
            onSubmit={() => handleSubmit(handleFormSubmit)()}
            isPending={isPending}
            isDisabled={!isValid || (isEnable && !qrCodeImage)}
            submitText={isEnable ? 'Enable' : 'Disable'}
            pendingText="Verifying..."
            cancelText="Cancel"
            variant={isEnable ? 'default' : 'danger'}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};