import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Loader2, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, Input } from '@pipeline/ui';
import { DialogHeader, DialogBody, DialogFooter, AppButton } from '@/shared/ui';
import {
  twoFactorTotpOnlySchema,
  twoFactorCodeOrBackupSchema,
} from '@pipeline/contracts';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string) => Promise<string[] | void> | void;
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
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);

  const activeSchema = isEnable ? twoFactorTotpOnlySchema : twoFactorCodeOrBackupSchema;
  type TFormSchema = z.infer<typeof activeSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TFormSchema>({
    resolver: zodResolver(activeSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { code: '' },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ code: '' });
      setRecoveryCodes(null);
      setCopied(false);
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset({ code: '' });
    setRecoveryCodes(null);
    onClose();
  };

  const handleFormSubmit = async (data: TFormSchema) => {
    try {
      const result = await onConfirm(data.code);
      if (Array.isArray(result) && result.length > 0) {
        setRecoveryCodes(result);
      } else if (!isEnable) {
        handleClose();
      }
    } catch {
    }
  };

  const handleCopyCodes = () => {
    if (!recoveryCodes) return;
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasCodeError = !!errors.code;

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

        {recoveryCodes ? (
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Save your recovery codes
              </h3>
              <p className="text-xs text-muted-foreground">
                Store these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg border border-border/60 font-mono text-xs text-center">
              {recoveryCodes.map((c, i) => (
                <div key={i} className="py-1 px-2 bg-background rounded border border-border/40">
                  {c}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <AppButton
                type="button"
                variant="secondary"
                onClick={handleCopyCodes}
                className="flex-1 text-sm"
                text={copied ? 'Copied to clipboard' : 'Copy codes'}
                icon={copied ? Check : Copy}
              />

              <AppButton
                type="button"
                variant="primary"
                onClick={handleClose}
                className="flex-1 text-sm"
                text="Done"
                icon={null}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <DialogBody withBorder className="space-y-5">
              {modalError && (
                <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {modalError}
                </div>
              )}

              {isEnable ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="flex-none flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold leading-none">
                        1
                      </span>
                      <p className="text-xs font-medium text-foreground/90 leading-relaxed pt-0.5">
                        Scan this QR code with your Authenticator app (Google Authenticator, Authy, etc.):
                      </p>
                    </div>

                    {qrCodeImage ? (
                      <div className="flex justify-center bg-white p-2.5 rounded-xl border border-border/80 shadow-xs w-fit mx-auto">
                        <img src={qrCodeImage} alt="2FA QR Code" className="w-40 h-40" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 gap-2 text-xs text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/60">
                        <Loader2 className="w-5 h-5 animate-spin text-teal-600 dark:text-teal-400" />
                        <span>Generating QR code...</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-1 mb-2 border-t border-border/40">
                    <div className="flex items-start gap-2.5 pt-3">
                      <span className="flex-none flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold leading-none">
                        2
                      </span>
                      <p className="text-xs font-medium text-foreground/90 leading-relaxed pt-0.5">
                        Enter the verification code from your app to confirm setup:
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Input
                        type="text"
                        maxLength={6}
                        autoFocus
                        autoComplete="one-time-code"
                        placeholder="123456"
                        {...register('code')}
                        className={`h-11 text-center font-mono text-3xl font-bold tracking-[0.3em] focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none transition-all ${
                          hasCodeError
                            ? 'border-rose-500 bg-rose-500/5 text-rose-600 dark:text-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/30'
                            : 'border-border bg-background text-foreground focus-visible:border-teal-500 focus-visible:ring-teal-500/30'
                        }`}
                      />
                      {errors.code && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 text-center">
                          {errors.code.message as string}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    Enter a valid 6-digit code or a backup recovery code to confirm disabling Two-Factor Authentication:
                  </p>

                  <div className="space-y-1.5">
                    <Input
                      type="text"
                      maxLength={32}
                      autoFocus
                      autoComplete="one-time-code"
                      placeholder="123456 or recovery code"
                      {...register('code')}
                      className={`h-11 text-center font-mono text-2xl font-bold tracking-normal placeholder:tracking-normal focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none transition-all ${
                        hasCodeError
                          ? 'border-rose-500 bg-rose-500/5 text-rose-600 dark:text-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/30'
                          : 'border-border bg-background text-foreground focus-visible:border-teal-500 focus-visible:ring-teal-500/30'
                      }`}
                    />
                    {errors.code && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 text-center">
                        {errors.code.message as string}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </DialogBody>

            <DialogFooter
              onCancel={handleClose}
              onSubmit={() => handleSubmit(handleFormSubmit)()}
              isPending={isPending}
              isDisabled={!isValid || (isEnable && !qrCodeImage)}
              submitText={isEnable ? 'Enable' : 'Disable'}
              pendingText="Verifying..."
              cancelText="Cancel"
              variant={isEnable ? 'primary' : 'danger'}
            />
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};