import { useNavigate } from 'react-router-dom';
import { Loader2, Layers, Sparkles } from 'lucide-react';
import { useBilling } from './hooks/useBilling';
import { SubscriptionCard, UsageStats, PaymentMethod, InvoiceHistory } from './components';

export const BillingTab = () => {
  const {
    isSubscriptionLoading,
    errorMessage,
    successMessage,
    dismissSuccess,
    dismissError,
  } = useBilling();
  const navigate = useNavigate();

  if (isSubscriptionLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-muted-foreground gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading subscription status...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Subscription & Billing</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your billing cycle, plan tiers, usage, and invoices.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/plans')}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-all cursor-pointer shadow-xs"
        >
          <Layers className="w-4 h-4 text-teal-500" />
          Compare All Plans
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-sm flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={dismissSuccess}
            className="text-xs font-semibold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={dismissError}
            className="text-xs font-semibold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <SubscriptionCard />

      <div className="space-y-4">
        <h3 className="text-xs font-bold tracking-wider uppercase text-foreground/80">
          Current Usage
        </h3>
        <UsageStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PaymentMethod />
        <InvoiceHistory />
      </div>

      <div className="border border-border bg-card/60 rounded-xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-teal-500" />
          Need more performance?
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          For dedicated infrastructure workloads, tailored execution timeout scales, and customized
          deployment topology models.
        </p>
        <button
          type="button"
          onClick={() => navigate('/plans')}
          className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline cursor-pointer inline-flex items-center gap-1"
        >
          View Enterprise Plan details
        </button>
      </div>
    </div>
  );
};