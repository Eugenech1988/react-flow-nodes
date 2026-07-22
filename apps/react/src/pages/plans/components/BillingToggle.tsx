import { Switch } from '@pipeline/ui';

interface BillingToggleProps {
  billingCycle: 'monthly' | 'yearly';
  onChange: (cycle: 'monthly' | 'yearly') => void;
}

export const BillingToggle = ({ billingCycle, onChange }: BillingToggleProps) => {
  const handleMonthly = () => onChange('monthly');
  const handleYearly = () => onChange('yearly');

  return (
    <div className="flex items-center justify-center gap-3">
      <span
        onClick={handleMonthly}
        className={`text-xs font-medium cursor-pointer transition-colors ${
          billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        Monthly
      </span>

      <Switch
        checked={billingCycle === 'yearly'}
        onCheckedChange={(checked) => onChange(checked ? 'yearly' : 'monthly')}
        style={{
          backgroundColor: billingCycle === 'yearly' ? 'var(--color-teal-600, #0d9488)' : undefined,
        }}
        className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-transparent cursor-pointer"
      />

      <span
        onClick={handleYearly}
        className={`text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
          billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        Yearly
        <span className="px-2 py-0.5 text-[10px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-full">
          Save 20%
        </span>
      </span>
    </div>
  );
};