import { Switch } from '@pipeline/ui';

interface BillingToggleProps {
  billingCycle: 'monthly' | 'yearly';
  onChange: (cycle: 'monthly' | 'yearly') => void;
}

const BASE_BUTTON_CLASSES =
  'cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50';

export const BillingToggle = ({ billingCycle, onChange }: BillingToggleProps) => {
  const isMonthly = billingCycle === 'monthly';
  const isYearly = billingCycle === 'yearly';

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onChange('monthly')}
        aria-pressed={isMonthly}
        className={`${BASE_BUTTON_CLASSES} ${
          isMonthly ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
        }`}
      >
        Monthly
      </button>

      <Switch
        checked={isYearly}
        onCheckedChange={(checked) => onChange(checked ? 'yearly' : 'monthly')}
        style={{
          backgroundColor: isYearly ? 'var(--color-teal-600, #0d9488)' : undefined,
        }}
        className="cursor-pointer border-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <button
        type="button"
        onClick={() => onChange('yearly')}
        aria-pressed={isYearly}
        className={`${BASE_BUTTON_CLASSES} flex items-center gap-1.5 ${
          isYearly ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
        }`}
      >
        Yearly
        <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-600 dark:text-teal-400">
          Save 20%
        </span>
      </button>
    </div>
  );
};
