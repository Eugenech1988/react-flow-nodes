import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent } from '@pipeline/ui';
import { DialogHeader, DialogBody, DialogFooter } from '@/shared/ui';
import { twoFactorLoginInputSchema } from '@pipeline/contracts';

type ITwoFactorFormData = z.infer<typeof twoFactorLoginInputSchema>;

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ITwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = (data: ITwoFactorFormData) => {
    onConfirm(data.code);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isEnable = mode === 'enable';

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
              <div className="text-sm text-rose-600">{modalError}</div>
            )}

            {isEnable && (
              <div className="space-y-2 text-center">
                <p className="text-xs text-muted-foreground text-left">
                  1. Scan this QR code with your Authenticator app (Google Authenticator, Authy):
                </p>
                {qrCodeImage ? (
                  <div className="flex justify-center bg-white p-2 rounded-lg border inline-block mx-auto">
                    <img src={qrCodeImage} alt="QR Code" className="w-40 h-40" />
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground py-6">Loading QR code...</div>
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
                maxLength={6}
                autoFocus
                placeholder="123456"
                {...register('code')}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-center tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
              {errors.code && (
                <p className="text-xs text-rose-600 mt-1">{errors.code.message}</p>
              )}
            </div>
          </DialogBody>

          <DialogFooter
            onCancel={handleClose}
            onSubmit={handleSubmit(handleFormSubmit)}
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