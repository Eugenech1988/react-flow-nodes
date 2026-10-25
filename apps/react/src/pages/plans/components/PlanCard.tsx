import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, CreditCard, Building2, ArrowRight, Loader2 } from 'lucide-react';
import type { IPlan, TPlanId } from '../model';

interface PlanCardProps {
  plan: IPlan;
  isCurrent: boolean;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  buttonText: string;
  buttonVariant: 'outline' | 'primary' | 'secondary';
  isProcessing: boolean;
  onSelect: (planId: TPlanId) => void;
}

export const PlanCard = ({
  plan,
  isCurrent,
  price,
  billingCycle,
  buttonText,
  buttonVariant,
  isProcessing,
  onSelect,
}: PlanCardProps) => {
  const isPopular = plan.popular;

  const handleClick = () => {
    if (isCurrent) return;
    onSelect(plan.id);
  };

  const getButtonClasses = () => {
    const base =
      'w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer';

    if (isCurrent) {
      return `${base} bg-muted text-muted-foreground cursor-not-allowed opacity-80`;
    }

    switch (buttonVariant) {
      case 'primary':
        return `${base} bg-linear-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 active:from-teal-800 active:to-teal-700 text-white shadow-xs`;
      case 'secondary':
        return `${base} border border-teal-500/30 bg-transparent text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/50 active:bg-teal-500/15 transition-all`;
      default:
        return `${base} border border-border bg-background hover:bg-muted text-foreground`;
    }
  };

  const renderIcon = () => {
    if (isProcessing) return <Loader2 className="h-3.5 w-3.5 animate-spin" />;

    if (plan.id === 'pro' && !isCurrent) return <CreditCard className="h-3.5 w-3.5" />;
    if (plan.id === 'enterprise') return <Building2 className="h-3.5 w-3.5" />;
    return null;
  };

  const renderButtonContent = () => {
    if (isProcessing) {
      return (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Processing...
        </>
      );
    }

    return (
      <>
        {renderIcon()}
        {buttonText}
        {!isCurrent && plan.id !== 'free' && <ArrowRight className="h-3.5 w-3.5" />}
      </>
    );
  };

  return (
    <motion.div
      className={`bg-card relative flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-xs transition-all duration-300 ${
        isCurrent
          ? '-translate-y-2 border-teal-500/60 shadow-lg ring-2 ring-teal-500/30'
          : isPopular
            ? 'border-teal-500/40 shadow-md'
            : 'border-border shadow-xs'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-linear-to-r from-teal-700 to-teal-600 px-3 py-0.5 text-[11px] font-semibold text-white shadow-xs">
          <Sparkles className="h-3 w-3" /> Most Popular
        </div>
      )}

      <div
        className={`pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl ${
          isCurrent || isPopular ? 'bg-teal-500/10' : 'bg-muted/20'
        }`}
      />

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{plan.name}</h3>
            {isCurrent && (
              <span className="rounded border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-teal-600 uppercase dark:text-teal-400">
                Current
              </span>
            )}
          </div>
          <p className="text-muted-foreground min-h-9 text-xs leading-relaxed">
            {plan.description}
          </p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold">${price}</span>
          <span className="text-muted-foreground text-xs font-normal">
            /month {billingCycle === 'yearly' && price > 0 ? '(billed annually)' : ''}
          </span>
        </div>

        <div className="border-border/60 border-t pt-4" />

        <div className="space-y-3">
          <span className="text-foreground/80 text-xs font-semibold tracking-wide uppercase">
            What's included:
          </span>
          <ul className="space-y-2.5">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs">
                {feature.included ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                ) : (
                  <div className="border-border/60 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border">
                    <span className="bg-muted-foreground/40 block h-px w-1.5" />
                  </div>
                )}
                <span
                  className={
                    feature.included
                      ? 'text-foreground/90'
                      : 'text-muted-foreground/50 line-through'
                  }
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-border/60 mt-6 border-t pt-6">
        <button
          type="button"
          onClick={handleClick}
          disabled={isCurrent || isProcessing}
          className={getButtonClasses()}
        >
          {renderButtonContent()}
        </button>
      </div>
    </motion.div>
  );
};
