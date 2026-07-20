import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { CheckCircle2, ArrowLeft, Zap, ShieldCheck, Sparkles, HelpCircle, XCircle } from 'lucide-react';

export const ActiveProPlanPage = () => {
  const isProActive = false;

  const containerVariants: Variants = {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.21, 1.02, 0.43, 1.01] }
    }
  };

  const features = [
    'Unlimited pipelines execution & storage',
    'Priority high-performance LLM node queue',
    'Advanced analytics & multi-db integrations',
    '24/7 Dedicated engineering support',
  ];

  const handleCancelSubscription = () => {
    // Вызов эндпоинта деактивации
  };

  const handleActivateSubscription = () => {
    // Вызов эндпоинта активации / переход на оплату
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 transition-colors duration-300">
      <motion.div
        className="max-w-2xl mx-auto space-y-8"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your billing cycle, dynamic plan tiers, and usage logs.
            </p>
          </div>
          <Link
            to="/settings/profile"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to settings
          </Link>
        </div>

        <div className={`relative border bg-card rounded-2xl p-6 md:p-8 shadow-md overflow-hidden backdrop-blur-xs transition-all ${isProActive ? 'border-emerald-500/20' : 'border-border'}`}>
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
              <h2 className="text-2xl font-bold">{isProActive ? 'Pro Account' : 'Free Account'}</h2>
            </div>

            <div className="sm:text-right">
              <div className="text-2xl font-bold">{isProActive ? '$49' : '$0'}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              {isProActive && <p className="text-xs text-muted-foreground mt-0.5">Next billing date: April 15, 2026</p>}
            </div>
          </div>

          <div className="py-6 space-y-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/80">
              {isProActive ? 'Included features' : 'Unlock Pro features'}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
              Secure corporate payment tier
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {isProActive ? (
                <>
                  <a href="#invoice" className="hover:text-foreground transition-colors underline underline-offset-4">View invoices</a>
                  <button
                    onClick={handleCancelSubscription}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/20 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/[0.03] transition-all cursor-pointer font-medium"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel subscription
                  </button>
                </>
              ) : (
                <button
                  onClick={handleActivateSubscription}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-br from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-medium shadow-sm active:scale-98 transition-all cursor-pointer text-sm"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Activate Pro Plan
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-border bg-muted/5 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-teal-500" />
              Need more performance?
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For dedicated infrastructure workloads, tailored execution timeout scales, and customized deployment topology models.
            </p>
            <button className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
              Contact Enterprise Sales →
            </button>
          </div>

          <div className="border border-border bg-muted/5 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
              Billing questions?
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Find instant solutions regarding transaction validation, international VAT processing updates, or custom developer invoicing.
            </p>
            <button className="text-xs font-medium text-foreground hover:underline cursor-pointer">
              Open Help Center →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};