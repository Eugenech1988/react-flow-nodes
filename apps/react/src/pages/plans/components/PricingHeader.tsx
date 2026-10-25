import { BillingToggle } from './BillingToggle';

interface PricingHeaderProps {
  billingCycle: 'monthly' | 'yearly';
  onBillingCycleChange: (cycle: 'monthly' | 'yearly') => void;
}

export const PricingHeader = ({ billingCycle, onBillingCycleChange }: PricingHeaderProps) => {
  return (
    <div className="mx-auto max-w-2xl space-y-3 text-center">
      <h2 className="text-3xl font-bold tracking-tight">Flexible Plans for Every Scale</h2>
      <p className="text-muted-foreground text-sm">
        Choose the plan that fits your execution volume and infrastructure needs. Upgrade,
        downgrade, or cancel anytime.
      </p>

      <div className="pt-2">
        <BillingToggle billingCycle={billingCycle} onChange={onBillingCycleChange} />
      </div>
    </div>
  );
};
