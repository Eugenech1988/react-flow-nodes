import { Zap, CheckCircle2, ShieldCheck, XCircle, CreditCard } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { PLAN_FEATURES } from '../../model';
import { useBilling } from '../hooks/useBilling';
import { useUser } from '@/shared/hooks';

export const SubscriptionCard = () => {
  const { isProActive } = useUser();
  const { isProcessing, subscription, cancelSubscription, activateSubscription } = useBilling();

  return (
    <div
      className={`bg-card relative overflow-hidden rounded-xl border p-6 shadow-xs backdrop-blur-xs transition-all ${
        isProActive ? 'border-teal-500/30 ring-1 ring-teal-500/20' : 'border-border'
      }`}
    >
      <div
        className={`pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full blur-3xl ${
          isProActive ? 'bg-teal-500/10' : 'bg-gradient-to-br from-teal-500/5 to-teal-600/5'
        }`}
      />

      <div className="border-border/60 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          {isProActive ? (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <Zap className="h-3.5 w-3.5 fill-current" />
              Active Plan
            </div>
          ) : (
            <div className="bg-muted text-muted-foreground border-border inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold">
              Free Tier
            </div>
          )}
          <h3 className="text-xl font-bold">{isProActive ? 'Pro Account' : 'Free Account'}</h3>
        </div>

        <div className="sm:text-right">
          <div className="text-2xl font-bold">
            {isProActive ? '$49' : '$0'}
            <span className="text-muted-foreground text-sm font-normal">/month</span>
          </div>
          {isProActive && subscription?.currentPeriodEnd && (
            <p className="text-muted-foreground mt-0.5 text-xs">
              Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 py-6">
        <h4 className="text-foreground/80 text-xs font-semibold tracking-wide uppercase">
          {isProActive ? 'Included features' : 'Unlock Pro features'}
        </h4>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PLAN_FEATURES.map((feature, idx) => (
            <li key={idx} className="text-foreground/90 flex items-start gap-2.5 text-sm">
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  isProActive ? 'text-teal-600 dark:text-teal-400' : 'text-muted-foreground/60'
                }`}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-border/60 text-muted-foreground flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs sm:flex-row">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className={`h-4 w-4 ${isProActive ? 'text-teal-600 dark:text-teal-400' : 'text-muted-foreground/60'}`}
          />
          Secure payments via Stripe
        </div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
          {isProActive ? (
            <>
              <AppButton
                variant="ghost"
                size="sm"
                isLink
                linkTo="/plans"
                text="Change plan"
                className="underline underline-offset-4"
              />
              <AppButton
                variant="danger"
                onClick={cancelSubscription}
                size="sm"
                isPending={isProcessing}
                text="Cancel subscription"
                icon={XCircle}
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <AppButton
                variant="primary"
                size="sm"
                isPending={isProcessing}
                text="Activate Pro Plan"
                pendingText="Redirecting..."
                icon={CreditCard}
                onClick={activateSubscription}
              />

              <AppButton
                variant="secondary"
                size="sm"
                isLink
                linkTo="/plans"
                text="Explore Plans"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
