import { CreditCard, ExternalLink } from 'lucide-react';
import { useBilling } from '../hooks';
import { useUser } from '@/shared/hooks';
import { AppButton } from '@/shared/ui';

export const PaymentMethod = () => {
  const { isProActive } = useUser();
  const { cancelSubscription } = useBilling();

  return (
    <div className="border border-border bg-card rounded-xl p-5 space-y-4 shadow-xs">
      <h3 className="text-xs font-bold tracking-wider uppercase text-foreground/80 flex items-center gap-2">
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

          <AppButton
            variant="ghost"
            size="xs"
            icon={ExternalLink}
            text="Update card details"
            onClick={cancelSubscription}
            className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 p-0 h-auto min-h-0 border-none flex-row-reverse"
          />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground leading-relaxed">
          No active payment method attached. Upgrade your plan to attach a payment card.
        </p>
      )}
    </div>
  );
};