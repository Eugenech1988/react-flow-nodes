import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  Sparkles,
  XCircle,
  CreditCard,
  Loader2,
  Layers,
  Download,
  Receipt,
  Clock,
  HardDrive,
  Cpu,
  ExternalLink
} from 'lucide-react';
import { useSubscription } from '@/shared/hooks';
import { api } from '@/shared/api';

// Моковые данные для истории платежей (замените на реальные данные с бэкенда)
const INVOICE_HISTORY = [
  { id: 'INV-2026-003', date: '2026-06-01', amount: '$49.00', status: 'Paid', pdfUrl: '#' },
  { id: 'INV-2026-002', date: '2026-05-01', amount: '$49.00', status: 'Paid', pdfUrl: '#' },
  { id: 'INV-2026-001', date: '2026-04-01', amount: '$49.00', status: 'Paid', pdfUrl: '#' },
];

export const BillingPage = () => {
  const { subscription, isProActive, isLoading, refetch } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setSuccessMessage('Payment successful! Your Pro plan is now active.');
      refetch?.();
      searchParams.delete('success');
      setSearchParams(searchParams, { replace: true });
    } else if (searchParams.get('canceled') === 'true') {
      setErrorMessage('Payment was canceled.');
      searchParams.delete('canceled');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, refetch]);

  const features = [
    'Unlimited pipelines execution & storage',
    'Priority high-performance LLM node queue',
    'Advanced analytics & multi-db integrations',
    '24/7 Dedicated engineering support',
  ];

  const handleActivateSubscription = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const data = await api.post<{ url: string }>('/billing/checkout', {
        plan: 'PRO',
      });

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to retrieve payment link from server.');
      }
    } catch (error: any) {
      console.error('Failed to create Stripe checkout session', error);
      const serverMessage = error?.response?.data?.message;
      const detailedMessage = Array.isArray(serverMessage) ? serverMessage.join(', ') : serverMessage;
      setErrorMessage(
        detailedMessage || error?.message || 'Failed to initialize payment. Please try again later.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = () => {
    window.location.href = '/settings/billing/portal';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-muted-foreground gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading subscription status...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Subscription & Billing</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your billing cycle, plan tiers, usage, and invoices.
          </p>
        </div>

        <button
          onClick={() => navigate('/plans')}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-all cursor-pointer shadow-xs"
        >
          <Layers className="w-4 h-4 text-teal-500" />
          Compare All Plans
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs font-semibold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs font-semibold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ACTIVE PLAN CARD */}
      <div className={`relative border bg-card rounded-2xl p-6 shadow-md overflow-hidden backdrop-blur-xs transition-all ${isProActive ? 'border-emerald-500/20' : 'border-border'}`}>
        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none ${isProActive ? 'bg-emerald-500/5' : 'bg-linear-to-br from-teal-500/5 to-emerald-500/5'}`} />

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
            <div className="text-2xl font-bold">{isProActive ? '$49' : '$0'}<span className="text-sm font-normal text-muted-foreground">/month</span></div>
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
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isProActive ? 'text-emerald-500' : 'text-muted-foreground/60'}`} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${isProActive ? 'text-emerald-500' : 'text-muted-foreground/60'}`} />
            Secure payments via Stripe
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {isProActive ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/plans')}
                  className="hover:text-foreground transition-colors underline underline-offset-4 cursor-pointer"
                >
                  Change plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/20 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/[0.03] transition-all cursor-pointer font-medium"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Manage subscription
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleActivateSubscription}
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
                  onClick={() => navigate('/plans')}
                  className="px-3 py-2 rounded-xl border border-border bg-muted/20 text-foreground hover:bg-muted font-medium transition-all cursor-pointer text-sm"
                >
                  Explore Plans
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NEW SECTION 1: USAGE METRICS */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/80">
          Current Usage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border bg-card rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Cpu className="w-4 h-4 text-teal-500" /> Pipeline Executions
              </span>
              <span>{isProActive ? 'Unlimited' : '85 / 100'}</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${isProActive ? 'bg-emerald-500' : 'bg-teal-500'}`}
                style={{ width: isProActive ? '100%' : '85%' }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Resets on the 1st of next month</p>
          </div>

          <div className="border border-border bg-card rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Clock className="w-4 h-4 text-teal-500" /> Execution Time
              </span>
              <span>{isProActive ? '12.4 hrs' : '4.2 / 5 hrs'}</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${isProActive ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: isProActive ? '30%' : '84%' }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Compute hours consumed this cycle</p>
          </div>

          <div className="border border-border bg-card rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <HardDrive className="w-4 h-4 text-teal-500" /> Pipeline Storage
              </span>
              <span>1.2 GB / {isProActive ? '100 GB' : '2 GB'}</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500"
                style={{ width: isProActive ? '1.2%' : '60%' }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Artifacts and cache storage</p>
          </div>
        </div>
      </div>

      {/* NEW SECTION 2: PAYMENT METHOD & PAYMENT HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Method Details */}
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
                onClick={handleCancelSubscription}
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

        {/* Invoice History */}
        <div className="lg:col-span-2 border border-border bg-card rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/80 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-teal-500" /> Invoice History
            </h3>
          </div>

          {isProActive ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-muted-foreground border-b border-border">
                <tr>
                  <th className="pb-2 font-medium">Invoice</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Receipt</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                {INVOICE_HISTORY.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/20">
                    <td className="py-2.5 font-medium">{invoice.id}</td>
                    <td className="py-2.5 text-muted-foreground">{invoice.date}</td>
                    <td className="py-2.5">{invoice.amount}</td>
                    <td className="py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {invoice.status}
                        </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <a
                        href={invoice.pdfUrl}
                        className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </a>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground py-4 text-center">
              No previous invoices found.
            </div>
          )}
        </div>
      </div>

      {/* ENTERPRISE BANNER */}
      <div className="border border-border bg-muted/5 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-teal-500" />
          Need more performance?
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          For dedicated infrastructure workloads, tailored execution timeout scales, and customized deployment topology models.
        </p>
        <button
          onClick={() => navigate('/plans')}
          className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
        >
          View Enterprise Plan details →
        </button>
      </div>
    </div>
  );
};