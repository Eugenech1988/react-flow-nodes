import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Loader2,
  ArrowRight,
  Building2,
  Check
} from 'lucide-react';
import { useSubscription } from '@/shared/hooks';
import { api } from '@/shared/api';
import { Switch } from '@pipeline/ui';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: PlanFeature[];
  buttonText: string;
  buttonVariant: 'outline' | 'primary' | 'secondary';
}

const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.21, 1.02, 0.43, 1.01] }
  }
};

export const PlansPage = () => {
  const { isProActive, isLoading } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Ideal for small projects and experimenting with basic features.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      buttonText: isProActive ? 'Downgrade to Free' : 'Current Plan',
      buttonVariant: 'outline',
      features: [
        { text: '5 active pipelines', included: true },
        { text: 'Standard queue processing', included: true },
        { text: 'Basic execution metrics', included: true },
        { text: 'Community support', included: true },
        { text: 'Advanced analytics & DB integration', included: false },
        { text: 'Dedicated engineering support', included: false },
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Perfect for power users and growing teams needing raw performance.',
      monthlyPrice: 49,
      yearlyPrice: 39,
      popular: true,
      buttonText: isProActive ? 'Current Plan' : 'Upgrade to Pro',
      buttonVariant: 'primary',
      features: [
        { text: 'Unlimited pipelines execution & storage', included: true },
        { text: 'Priority high-performance LLM node queue', included: true },
        { text: 'Advanced analytics & multi-db integrations', included: true },
        { text: '24/7 Dedicated engineering support', included: true },
        { text: 'SLA guarantees', included: false },
        { text: 'Custom deployment topologies', included: false },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For mission-critical infrastructure with dedicated capacity requirements.',
      monthlyPrice: 199,
      yearlyPrice: 159,
      buttonText: 'Contact Sales',
      buttonVariant: 'secondary',
      features: [
        { text: 'Everything in Pro plan', included: true },
        { text: 'Custom execution timeout scales', included: true },
        { text: 'Dedicated infrastructure workloads', included: true },
        { text: 'Customized deployment topology models', included: true },
        { text: '99.9% Uptime SLA', included: true },
        { text: 'Dedicated TAM & onboarding support', included: true },
      ],
    },
  ];

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      if (isProActive) {
        window.location.href = '/settings/billing/portal';
      }
      return;
    }

    if (planId === 'enterprise') {
      window.location.href = 'mailto:enterprise@yourdomain.com?subject=Enterprise%20Plan%20Inquiry';
      return;
    }

    if (planId === 'pro') {
      if (isProActive) return;

      try {
        setProcessingPlan(planId);
        setErrorMessage(null);

        const data = await api.post<{ url: string }>('/billing/checkout', {
          plan: 'PRO',
          interval: billingCycle,
        });

        if (data?.url) {
          window.location.href = data.url;
        } else {
          throw new Error('Failed to retrieve payment link from server.');
        }
      } catch (error: any) {
        console.error('Failed to create checkout session', error);
        const serverMessage = error?.response?.data?.message;
        const detailedMessage = Array.isArray(serverMessage) ? serverMessage.join(', ') : serverMessage;
        setErrorMessage(
          detailedMessage || error?.message || 'Failed to initialize payment. Please try again later.'
        );
      } finally {
        setProcessingPlan(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-muted-foreground gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading plans...
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8 max-w-6xl mx-auto py-6 px-4 md:px-6"
    >

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Flexible Plans for Every Scale</h2>
        <p className="text-muted-foreground text-sm">
          Choose the plan that fits your execution volume and infrastructure needs. Upgrade, downgrade, or cancel anytime.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <span
            onClick={() => setBillingCycle('monthly')}
            className={`text-xs font-medium cursor-pointer transition-colors ${
              billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Monthly
          </span>

          <Switch
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            style={{
              backgroundColor: billingCycle === 'yearly' ? '#10b981' : undefined,
            }}
            className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-transparent"
          />

          <span
            onClick={() => setBillingCycle('yearly')}
            className={`text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Yearly
            <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              Save 20%
            </span>
          </span>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4">
        {plans.map((plan) => {
          const isCurrent = (plan.id === 'pro' && isProActive) || (plan.id === 'free' && !isProActive);
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

          return (
            <div
              key={plan.id}
              className={`relative border bg-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 backdrop-blur-xs ${
                isCurrent
                  ? '-translate-y-3 shadow-xl border-emerald-500/60 ring-2 ring-emerald-500/30'
                  : plan.popular
                    ? 'border-emerald-500/40 shadow-md'
                    : 'border-border shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-linear-to-r from-teal-500 to-emerald-600 text-white shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}

              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none ${
                  isCurrent || plan.popular ? 'bg-emerald-500/10' : 'bg-muted/20'
                }`}
              />

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed min-h-9">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold">${price}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    /month {billingCycle === 'yearly' && price > 0 ? '(billed annually)' : ''}
                  </span>
                </div>

                <div className="border-t border-border/60 pt-4" />

                <div className="space-y-3">
                  <span className="text-xs font-semibold tracking-wide uppercase text-foreground/80">
                    What's included:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs">
                        {feature.included ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                        ) : (
                          <div className="w-4 h-4 shrink-0 rounded-full border border-border/60 flex items-center justify-center mt-0.5">
                            <span className="block w-1.5 h-px bg-muted-foreground/40" />
                          </div>
                        )}
                        <span className={feature.included ? 'text-foreground/90' : 'text-muted-foreground/50 line-through'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrent || processingPlan === plan.id}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-80'
                      : plan.buttonVariant === 'primary'
                        ? 'bg-linear-to-br from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-sm active:scale-98'
                        : plan.buttonVariant === 'secondary'
                          ? 'bg-foreground text-background hover:opacity-90 active:scale-98'
                          : 'border border-border bg-background hover:bg-muted text-foreground active:scale-98'
                  }`}
                >
                  {processingPlan === plan.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.id === 'pro' && !isCurrent && <CreditCard className="w-3.5 h-3.5" />}
                      {plan.id === 'enterprise' && <Building2 className="w-3.5 h-3.5" />}
                      {plan.buttonText}
                      {!isCurrent && plan.id !== 'free' && <ArrowRight className="w-3.5 h-3.5" />}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4 border-t border-border/40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted payment processing via Stripe</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> Cancel anytime
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> Instant activation
          </span>
        </div>
      </div>
    </motion.div>
  );
};