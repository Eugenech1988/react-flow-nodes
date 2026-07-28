import { useState } from 'react';
import { motion, } from 'framer-motion';
import { ShieldCheck, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@/shared/hooks';
import { getPlans, getPlanMeta, type TPlanId } from './model';
import { PricingHeader, PlanCard, ErrorBanner } from './components';
import { usePlanSelection } from '@/pages/plans/hooks';
import { PAGE_VARIANTS } from '@/shared/lib';

export const PlansPage = () => {
  const { isLoading, isProActive } = useUser();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const { processingPlan, errorMessage, setErrorMessage, handleSelectPlan } =
    usePlanSelection(isProActive);

  const plans = getPlans();

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
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
      className="space-y-8 max-w-6xl mx-auto py-6 px-4 md:px-6"
    >
      <div>
        <Link
          to="/settings/billing"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Billing Settings</span>
        </Link>
      </div>

      <PricingHeader
        billingCycle={billingCycle}
        onBillingCycleChange={setBillingCycle}
      />

      {errorMessage && (
        <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4">
        {plans.map((plan) => {
          const { isCurrent, buttonText, buttonVariant } = getPlanMeta(
            plan.id,
            isProActive
          );
          const price =
            billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={isCurrent}
              price={price}
              billingCycle={billingCycle}
              buttonText={buttonText}
              buttonVariant={buttonVariant}
              isProcessing={processingPlan === plan.id}
              onSelect={(planId: TPlanId) =>
                handleSelectPlan(planId, billingCycle)
              }
            />
          );
        })}
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4 border-t border-border/40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Encrypted payment processing via Stripe</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Cancel
            anytime
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Instant
            activation
          </span>
        </div>
      </div>
    </motion.div>
  );
};