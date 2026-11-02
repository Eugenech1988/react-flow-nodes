import { CreditCard, ExternalLink } from 'lucide-react';
import { useBilling } from '../hooks';
import { useUser } from '@/shared/hooks';
import { AppButton } from '@/shared/ui';

export const PaymentMethod = () => {
  const { isProActive } = useUser();
  const { cancelSubscription } = useBilling();

  return (
    <div className="border-border bg-card space-y-4 rounded-xl border p-5 shadow-xs">
      <h3 className="text-foreground/80 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
        <CreditCard className="h-4 w-4 text-teal-500" /> Payment Method
      </h3>
      {isProActive ? (
        <div className="space-y-3">
          <div className="border-border bg-muted/20 flex items-center gap-3 rounded-lg border p-3">
            <div className="bg-foreground/10 flex h-7 w-10 items-center justify-center rounded text-xs font-bold">
              VISA
            </div>
            <div>
              <p className="text-xs font-medium">•••• •••• •••• 4242</p>
              <p className="text-muted-foreground text-[11px]">Expires 12/28</p>
            </div>
          </div>

          <AppButton
            variant="ghost"
            size="xs"
            icon={ExternalLink}
            text="Update card details"
            onClick={cancelSubscription}
            className="h-auto min-h-0 flex-row-reverse border-none p-0 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          />
        </div>
      ) : (
        <p className="text-muted-foreground text-xs leading-relaxed">
          No active payment method attached. Upgrade your plan to attach a payment card.
        </p>
      )}
    </div>
  );
};
