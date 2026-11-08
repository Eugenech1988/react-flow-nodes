'use client';

import { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';
import { SectionHeading, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';
import { PRICING_TIERS } from './constants';
import { useInView } from '@/shared/hooks';

export const PricingSection = () => {
  const { t } = useT('marketing');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const { ref: sectionRef, inView } = useInView<HTMLDivElement>();

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-slate-800 bg-slate-950 py-20 text-slate-100 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#2dd4bf_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.03]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#2dd4bf]/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <SectionHeading
            title={t('pricing.heading.title')}
            description={t('pricing.heading.description')}
            isMain={false}
          />
        </div>

        <div ref={sectionRef} className="mt-16 grid grid-cols-1 items-start gap-8 md:grid-cols-3">
          {PRICING_TIERS.map((tier, index) => {
            const isPopular = tier.popular;
            const isEnterprise = tier.id === 'enterprise';

            const features = t(`pricing.tiers.${tier.id}.features`, {
              returnObjects: true,
            }) as string[];

            const buttonContent = t(`pricing.tiers.${tier.id}.cta`);

            const buttonClassName = `w-full ${
              !isPopular
                ? 'border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:text-white'
                : ''
            }`;

            return (
              <div
                key={tier.id}
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 backdrop-blur-md transition-colors sm:p-8 ${
                  inView ? 'animate-in fade-in slide-in-from-bottom-8 ease-[cubic-bezier(0.22,1,0.36,1)] duration-700' : 'opacity-0'
                } ${
                  isPopular
                    ? 'border-2 border-[#2dd4bf]/60 bg-linear-to-br from-[#0d1f1e] via-[#0a1615] to-[#06100f] shadow-[0_0_40px_rgba(45,212,191,0.15)] md:-translate-y-4'
                    : 'border border-slate-800 bg-slate-900/60 hover:border-[#2dd4bf]/40 hover:bg-slate-900/80'
                }`}
                style={{
                  animationDelay: inView ? `${index * 150}ms` : '0ms',
                  animationFillMode: 'both',
                }}
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

                    <p className="mt-4 min-h-12 text-sm leading-relaxed text-slate-400">
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

                {isEnterprise ? (
                  <AppButton
                    type="button"
                    variant="ghost"
                    size="lg"
                    className={buttonClassName}
                    onClick={() => setIsInquiryOpen(true)}
                  >
                    {buttonContent}
                  </AppButton>
                ) : (
                  <AppButton
                    isLink
                    linkTo={tier.href || '#'}
                    variant={isPopular ? 'primary' : 'ghost'}
                    size="lg"
                    className={buttonClassName}
                  >
                    {buttonContent}
                  </AppButton>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={`mt-16 flex flex-col items-center justify-center gap-2 text-center font-mono text-xs text-slate-500 sm:flex-row ${
            inView ? 'animate-in fade-in duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]' : 'opacity-0'
          }`}
          style={{
            animationDelay: inView ? '600ms' : '0ms',
            animationFillMode: 'both',
          }}
        >
          <HelpCircle className="h-4 w-4 text-[#2dd4bf]" />

          <span>
            {t('pricing.footer.question')}{' '}
            <InquiryModal type="contact">
              <button
                type="button"
                className="cursor-pointer text-[#2dd4bf] underline decoration-[#2dd4bf]/30 underline-offset-4 transition-colors hover:text-[#5eead4]"
              >
                {t('pricing.footer.link')}
              </button>
            </InquiryModal>
          </span>
        </div>

        <InquiryModal type="contact" isOpen={isInquiryOpen} onOpenChange={setIsInquiryOpen} />
      </div>
    </section>
  );
};