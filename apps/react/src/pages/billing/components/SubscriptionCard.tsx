import { Zap, CheckCircle2, ShieldCheck, XCircle, CreditCard, Loader2 } from 'lucide-react';

interface SubscriptionCardProps {
  isProActive: boolean;
  isProcessing: boolean;
  subscription?: { currentPeriodEnd?: string };
  features: string[];
  onActivate: () => void;
  onCancel: () => void;
  onComparePlans: () => void;
  onExplorePlans: () => void;
}

export const SubscriptionCard = ({
                                   isProActive,
                                   isProcessing,
                                   subscription,
                                   features,
                                   onActivate,
                                   onCancel,
                                   onComparePlans,
                                   onExplorePlans,
                                 }: SubscriptionCardProps) => {
  return (
    <div
      className={`relative border bg-card rounded-2xl p-6 shadow-md overflow-hidden backdrop-blur-xs transition-all ${
        isProActive ? 'border-emerald-500/20' : 'border-border'
      }`}
    >
      <div
        className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          isProActive ? 'bg-emerald-500/5' : 'bg-linear-to-br from-teal-500/5 to-emerald-500/5'
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div className="space-y-1.5">
          {isProActive ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Active Plan
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border">
              Free Tier
            </div>
          )}
          <h3 className="text-xl font-bold">{isProActive ? 'Pro Account' : 'Free Account'}</h3>
        </div>

        <div className="sm:text-right">
          <div className="text-2xl font-bold">
            {isProActive ? '$49' : '$0'}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
          {isProActive && subscription?.currentPeriodEnd && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="py-6 space-y-4">
        <h4 className="text-xs font-semibold tracking-wide uppercase text-foreground/80">
          {isProActive ? 'Included features' : 'Unlock Pro features'}
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/90">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  isProActive ? 'text-emerald-500' : 'text-muted-foreground/60'
                }`}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className={`w-4 h-4 ${isProActive ? 'text-emerald-500' : 'text-muted-foreground/60'}`}
          />
          Secure payments via Stripe
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {isProActive ? (
            <>
              <button
                type="button"
                onClick={onComparePlans}
                className="hover:text-foreground transition-colors underline underline-offset-4 cursor-pointer"
              >
                Change plan
              </button>
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/20 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/3 transition-all cursor-pointer font-medium"
              >
                <XCircle className="w-3.5 h-3.5" />
                Manage subscription
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onActivate}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-br from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-medium shadow-sm active:scale-98 transition-all cursor-pointer text-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Activate Pro Plan
                  </>
                )}
              </button>

              <button
                onClick={onExplorePlans}
                className="px-3 py-2 rounded-xl border border-border bg-muted/20 text-foreground hover:bg-muted font-medium transition-all cursor-pointer text-sm"
              >
                Explore Plans
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};