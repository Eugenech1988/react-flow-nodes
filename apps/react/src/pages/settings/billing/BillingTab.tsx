import { Loader2, Layers, Sparkles } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { useBilling } from './hooks/useBilling';
import { SubscriptionCard, UsageStats, PaymentMethod, InvoiceHistory } from './components';

export const BillingTab = () => {
  const { isSubscriptionLoading, errorMessage, successMessage, dismissSuccess, dismissError } =
    useBilling();

  if (isSubscriptionLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 p-12 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading subscription status...
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-12rem)] max-w-5xl space-y-8 overflow-y-auto pr-2 pb-20">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Subscription & Billing</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Manage your billing cycle, plan tiers, usage, and invoices.
          </p>
        </div>

        <AppButton
          variant="secondary"
          size="sm"
          isLink
          linkTo="/plans"
          icon={Layers}
          iconClassName="text-teal-400"
          text="Compare All Plans"
        />
      </div>

      {successMessage && (
        <div className="flex items-center justify-between rounded-xl border border-teal-500/20 bg-teal-500/10 p-4 text-sm text-teal-600 dark:text-teal-400">
          <span>{successMessage}</span>
          <AppButton
            variant="ghost"
            size="xs"
            onClick={dismissSuccess}
            text="Dismiss"
            className="h-auto min-h-0 border-none p-0 font-semibold text-teal-600 underline hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          />
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400">
          <span>{errorMessage}</span>
          <AppButton
            variant="ghost"
            size="xs"
            onClick={dismissError}
            text="Dismiss"
            className="h-auto min-h-0 border-none p-0 font-semibold text-rose-600 underline hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
          />
        </div>
      )}

      <SubscriptionCard />

      <div className="space-y-4">
        <h3 className="text-foreground/80 text-xs font-bold tracking-wider uppercase">
          Current Usage
        </h3>
        <UsageStats />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PaymentMethod />
        <InvoiceHistory />
      </div>

      <div className="border-border bg-card/60 space-y-3 rounded-xl border p-5 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-teal-500" />
          Need more performance?
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          For dedicated infrastructure workloads, tailored execution timeout scales, and customized
          deployment topology models.
        </p>

        <AppButton
          variant="ghost"
          size="xs"
          isLink
          linkTo="/plans"
          text="View Enterprise Plan details"
          className="h-auto min-h-0 justify-start border-none p-0 text-teal-600 underline hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        />
      </div>
    </div>
  );
};
