import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@/shared/hooks';
import { getPlans, getPlanMeta, type TPlanId } from './model';
import { PricingHeader, PlanCard, ErrorBanner } from './components';
import { usePlanSelection } from './hooks';
import { PAGE_VARIANTS } from '@/shared/lib';

export const PlansPage = () => {
  const { isLoading, isProActive } = useUser();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const { processingPlan, errorMessage, setErrorMessage, handleSelectPlan } =
    usePlanSelection(isProActive);

  const plans = getPlans();

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 p-12 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading plans...
      </div>
    );
  }

  return (
    <motion.div
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-6"
    >
      <div>
        <Link
          to="/settings/billing"
          className="text-muted-foreground hover:text-foreground group inline-flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Billing Settings</span>
        </Link>
      </div>

      <PricingHeader billingCycle={billingCycle} onBillingCycleChange={setBillingCycle} />

      {errorMessage && (
        <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />
      )}

      <div className="grid grid-cols-1 items-stretch gap-6 pt-4 md:grid-cols-3">
        {plans.map((plan) => {
          const { isCurrent, buttonText, buttonVariant } = getPlanMeta(plan.id, isProActive);
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

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
              onSelect={(planId: TPlanId) => handleSelectPlan(planId, billingCycle)}
            />
          );
        })}
      </div>

      <div className="text-muted-foreground border-border/40 flex flex-col items-center justify-between gap-4 border-t pt-4 text-xs sm:flex-row">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Encrypted payment processing via Stripe</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> Cancel anytime
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> Instant activation
          </span>
        </div>
      </div>
    </motion.div>
  );
};
