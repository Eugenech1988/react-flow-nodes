import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, Input } from '@pipeline/ui';
import { DialogHeader, DialogBody, DialogFooter, AppButton } from '@/shared/ui';
import { twoFactorTotpOnlySchema, twoFactorCodeOrBackupSchema } from '@pipeline/contracts';

type TTwoFactorMode = 'enable' | 'disable';

interface ITwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string) => Promise<string[] | void>;
  onRetryGenerate?: () => void;
  mode: TTwoFactorMode;
  qrCodeImage?: string | null;
  modalError?: string | null;
  isPending?: boolean;
}

interface ITotpFormData {
  code: string;
}

export const TwoFactorModal = ({
  isOpen,
  onClose,
  onConfirm,
  onRetryGenerate,
  mode,
  qrCodeImage,
  modalError,
  isPending = false,
}: ITwoFactorModalProps) => {
  const isEnable = mode === 'enable';
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(false);

  const activeSchema = isEnable ? twoFactorTotpOnlySchema : twoFactorCodeOrBackupSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ITotpFormData>({
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

  const handleFormSubmit = async (data: ITotpFormData) => {
    try {
      const result = await onConfirm(data.code);
      if (isEnable && Array.isArray(result) && result.length > 0) {
        setRecoveryCodes(result);
        return;
      }
      if (!isEnable) {
        handleClose();
      }
    } catch {}
  };

  const handleCopyCodes = () => {
    if (!recoveryCodes) return;
    void navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const hasCodeError = Boolean(errors.code);
  const qrGenerationFailed = isEnable && !qrCodeImage && Boolean(modalError);

  return (
    <Dialog open={isOpen} onOpenChange={recoveryCodes ? undefined : handleClose}>
      <DialogContent
        showCloseButton={false}
        className="border-border bg-card gap-0 overflow-hidden rounded-xl p-0 shadow-lg backdrop-blur-md sm:max-w-md"
      >
        <DialogHeader
          title={isEnable ? 'Enable 2FA' : 'Disable 2FA'}
          icon={<ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
          onClose={handleClose}
        />

        {recoveryCodes ? (
          <div className="space-y-4 p-6">
            <div className="space-y-1">
              <h3 className="text-foreground text-sm font-semibold">Save your recovery codes</h3>
              <p className="text-muted-foreground text-xs">
                Store these backup codes in a safe place. You can use them to access your account if
                you lose your authenticator device.
              </p>
            </div>

            <div className="bg-muted/30 border-border/60 grid grid-cols-2 gap-2 rounded-lg border p-3 text-center font-mono text-xs">
              {recoveryCodes.map((code) => (
                <div key={code} className="bg-background border-border/40 rounded border px-2 py-1">
                  {code}
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
          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <DialogBody withBorder className="space-y-5">
              {modalError && (
                <div className="space-y-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <p>{modalError}</p>
                  {qrGenerationFailed && onRetryGenerate && (
                    <AppButton
                      type="button"
                      variant="secondary"
                      size="xs"
                      icon={RefreshCw}
                      text="Retry"
                      onClick={onRetryGenerate}
                    />
                  )}
                </div>
              )}

              {isEnable ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-500/10 text-xs leading-none font-bold text-teal-600 dark:text-teal-400">
                        1
                      </span>
                      <p className="text-foreground/90 pt-0.5 text-xs leading-relaxed font-medium">
                        Scan this QR code with your Authenticator app (Google Authenticator, Authy,
                        etc.):
                      </p>
                    </div>

                    {qrCodeImage ? (
                      <div className="border-border/80 mx-auto flex w-fit justify-center rounded-xl border bg-white p-2.5 shadow-xs">
                        <img src={qrCodeImage} alt="2FA QR Code" className="h-40 w-40" />
                      </div>
                    ) : (
                      <div className="text-muted-foreground bg-muted/10 border-border/60 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-8 text-xs">
                        <Loader2 className="h-5 w-5 animate-spin text-teal-600 dark:text-teal-400" />
                        <span>Generating QR code...</span>
                      </div>
                    )}
                  </div>

                  <div className="border-border/40 mb-2 space-y-4 border-t pt-1">
                    <div className="flex items-start gap-2.5 pt-3">
                      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-500/10 text-xs leading-none font-bold text-teal-600 dark:text-teal-400">
                        2
                      </span>
                      <p className="text-foreground/90 pt-0.5 text-xs leading-relaxed font-medium">
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
                        className={`h-11 text-center font-mono text-3xl font-bold tracking-[0.3em] transition-all focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none ${
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
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                    Enter a valid 6-digit code or a backup recovery code to confirm disabling
                    Two-Factor Authentication:
                  </p>

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
                </div>
              )}
            </DialogBody>

            <DialogFooter
              onCancel={handleClose}
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
