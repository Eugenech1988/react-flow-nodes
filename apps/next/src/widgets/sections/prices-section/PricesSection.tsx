'use client';

import { motion } from 'framer-motion';
import { Check, HelpCircle } from 'lucide-react';
import { SectionHeading, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { PRICING_TIERS, PRICING_CONTAINER_VARIANTS, PRICING_CARD_VARIANTS } from './model';

export const PricingSection = () => {
  const { t } = useT('marketing');

  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950 py-20 text-slate-100 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#2dd4bf_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.03]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#2dd4bf]/[0.05] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2dd4bf]/30 bg-[#2dd4bf]/10 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-[#2dd4bf] uppercase shadow-[inset_0_1px_0_rgba(45,212,191,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf] shadow-[0_0_5px_#2dd4bf]" />
            {t('pricing.badge')}
          </div>

          <SectionHeading
            title={t('pricing.heading.title')}
            description={t('pricing.heading.description')}
            isMain={false}
          />
        </div>

        <motion.div
          variants={PRICING_CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid grid-cols-1 items-start gap-8 md:grid-cols-3"
        >
          {PRICING_TIERS.map((tier) => {
            const isPopular = tier.popular;
            const features = t(`pricing.tiers.${tier.id}.features`, {
              returnObjects: true,
            }) as string[];

            return (
              <motion.div
                key={tier.id}
                variants={PRICING_CARD_VARIANTS}
                className={`relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 backdrop-blur-md transition-all duration-300 sm:p-8 ${
                  isPopular
                    ? 'border-2 border-[#2dd4bf]/60 bg-linear-to-br from-[#0d1f1e] via-[#0a1615] to-[#06100f] shadow-[0_0_40px_rgba(45,212,191,0.15)] md:-translate-y-4'
                    : 'border border-slate-800 bg-slate-900/60 hover:border-[#2dd4bf]/40 hover:bg-slate-900/80'
                }`}
              >
                <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                <span className="absolute right-3 bottom-3 h-1.5 w-1.5 rounded-full bg-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />

                {isPopular && (
                  <div className="absolute top-0 right-0 rounded-bl-2xl border-b border-l border-[#2dd4bf]/40 bg-[#2dd4bf]/15 px-4 py-1.5 font-mono text-[10px] font-bold tracking-widest text-[#5eead4] uppercase">
                    {t('pricing.popular')}
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#d1faf5]">
                      {t(`pricing.tiers.${tier.id}.name`)}
                    </h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        {t(`pricing.tiers.${tier.id}.price`)}
                      </span>
                      {t(`pricing.tiers.${tier.id}.period`) && (
                        <span className="font-mono text-sm text-[#2dd4bf]/70">
                          {t(`pricing.tiers.${tier.id}.period`)}
                        </span>
                      )}
                    </div>
                    <p className="mt-4 min-h-[48px] text-sm leading-relaxed text-slate-400">
                      {t(`pricing.tiers.${tier.id}.description`)}
                    </p>
                  </div>

                  <ul className="mb-8 space-y-4 border-t border-slate-800/80 pt-6">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#2dd4bf]/30 bg-[#2dd4bf]/10 text-[#5eead4]">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </div>
                        <span className="text-sm leading-snug text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <AppButton
                  isLink
                  linkTo={tier.href}
                  variant={isPopular ? 'primary' : 'ghost'}
                  size="lg"
                  className={`w-full ${
                    !isPopular
                      ? 'border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:text-white'
                      : ''
                  }`}
                >
                  {t(`pricing.tiers.${tier.id}.cta`)}
                </AppButton>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-col items-center justify-center gap-2 text-center font-mono text-xs text-slate-500 sm:flex-row"
        >
          <HelpCircle className="h-4 w-4 text-[#2dd4bf]" />
          <span>
            {t('pricing.footer.question')}{' '}
            <a
              href="#contact"
              className="text-[#2dd4bf] underline decoration-[#2dd4bf]/30 underline-offset-4 transition-colors hover:text-[#5eead4]"
            >
              {t('pricing.footer.link')}
            </a>
          </span>
        </motion.div>
      </div>
    </section>
  );
};
