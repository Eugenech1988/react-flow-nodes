import { ShieldCheck } from 'lucide-react';
import { Switch } from '@pipeline/ui';
import { LocalAlert } from '@/shared/ui';
import { TwoFactorModal } from './TwoFactorModal';
import { use2faSection } from '../hooks';

export const TwoFactorSection = () => {
  const { user2fa, is2faPending, modal2fa, alert } = use2faSection();

  return (
    <div className="border-border bg-card space-y-4 rounded-xl border p-6 shadow-xs">
      {!modal2fa.isOpen && alert && (
        <LocalAlert
          hasSuccess={alert.type === 'success'}
          hasError={alert.type === 'error'}
          alertMessage={alert.message}
        />
      )}

      <label
        htmlFor="2fa-switch"
        className="group border-border/60 bg-muted/5 hover:bg-muted/15 flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors select-none"
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal-600 transition-transform group-hover:scale-105" />
            <span id="2fa-label" className="text-foreground text-sm font-medium">
              Two-Factor Authentication (2FA)
            </span>
          </div>
          <p id="2fa-description" className="text-muted-foreground text-xs">
            Add an extra layer of security to your account during login.
          </p>
        </div>

        <Switch
          id="2fa-switch"
          checked={user2fa}
          onCheckedChange={modal2fa.handleToggleClick}
          disabled={is2faPending || modal2fa.isGenerating}
          aria-labelledby="2fa-label"
          aria-describedby="2fa-description"
          style={{
            backgroundColor: user2fa ? 'var(--color-teal-600, #0d9488)' : undefined,
          }}
          className="cursor-pointer border-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </label>

      <TwoFactorModal
        isOpen={modal2fa.isOpen}
        onClose={modal2fa.handleClose}
        onConfirm={modal2fa.handleConfirm}
        mode={modal2fa.mode}
        qrCodeImage={modal2fa.qrCodeImage}
        modalError={modal2fa.error}
        isPending={is2faPending}
      />
    </div>
  );
};
