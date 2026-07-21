// src/pages/settings/billing/components/PaymentMethod.tsx
import { CreditCard, ExternalLink } from 'lucide-react';

interface PaymentMethodProps {
  isProActive: boolean;
  onManageSubscription: () => void;
}

export const PaymentMethod = ({ isProActive, onManageSubscription }: PaymentMethodProps) => {
  return (
    <div className="border border-border bg-card rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/80 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-teal-500" /> Payment Method
      </h3>
      {isProActive ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
            <div className="w-10 h-7 bg-foreground/10 rounded flex items-center justify-center font-bold text-xs">
              VISA
            </div>
            <div>
              <p className="text-xs font-medium">•••• •••• •••• 4242</p>
              <p className="text-[11px] text-muted-foreground">Expires 12/28</p>
            </div>
          </div>
          <button
            onClick={onManageSubscription}
            className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            Update card details <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          No active payment method attached. Upgrade your plan to attach a payment card.
        </p>
      )}
    </div>
  );
};