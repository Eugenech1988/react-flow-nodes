'use client';

import { useState } from 'react';
import { Check, HelpCircle, Network, Factory } from 'lucide-react';
import {
  Section,
  SectionDecorator,
  TechCard,
  Reveal,
  SectionHeading,
  AppButton,
} from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';
import { PRICING_TIERS } from './constants';
import { cn } from '@/shared/lib';

export const PricingSection = () => {
  const { t } = useT('marketing');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  return (
    <Section id="pricing" className="bg-slate-950 text-slate-100">
      <SectionDecorator icon={Network} position="top-left" opacity={0.05} />
      <SectionDecorator icon={Factory} position="bottom-right" opacity={0.05} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <SectionHeading
            title={t('pricing.heading.title')}
            description={t('pricing.heading.description')}
            isMain={false}
          />
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-8 md:grid-cols-3">
          {PRICING_TIERS.map((tier, index) => {
            const isPopular = tier.popular;
            const isEnterprise = tier.id === 'enterprise';

            const featuresRaw = t(`pricing.tiers.${tier.id}.features`, {
              returnObjects: true,
            });
            const features = Array.isArray(featuresRaw) ? (featuresRaw as string[]) : [];

            const buttonContent = t(`pricing.tiers.${tier.id}.cta`);

            const buttonClassName = cn(
              'w-full',
              !isPopular &&
                'border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:text-white',
            );

            return (
              <Reveal key={tier.id} delay={index * 150} className="h-full">
                <TechCard
                  popular={isPopular}
                  className={cn(
                    'h-full justify-between rounded-3xl p-6 sm:p-8',
                    isPopular && 'md:-translate-y-4',
                  )}
                >
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
                      {/* min-h-12 отлично выравнивает блоки с описанием */}
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
                </TechCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal
          delay={600}
          className="mt-16 flex flex-col items-center justify-center gap-2 text-center font-mono text-xs text-slate-500 sm:flex-row"
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
        </Reveal>

        <InquiryModal type="contact" isOpen={isInquiryOpen} onOpenChange={setIsInquiryOpen} />
      </div>
    </Section>
  );
};
