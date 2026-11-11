'use client';

import { Quote, Star, Activity, ShieldCheck } from 'lucide-react';
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
import { TESTIMONIALS_DATA } from './constants';

export const TestimonialsSection = () => {
  const { t } = useT('marketing');

  return (
    <Section id="testimonials">
      <SectionDecorator icon={Activity} position="top-left" opacity={0.02} />
      <SectionDecorator icon={ShieldCheck} position="bottom-right" opacity={0.02} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          gradientDirection="left"
          title={t('testimonials.heading.title')}
          description={t('testimonials.heading.description')}
          isMain={false}
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {TESTIMONIALS_DATA.map((item, index) => (
            <Reveal key={item.id} delay={index * 150}>
              <TechCard className={`h-full justify-between p-5 sm:p-8 ${item.rotation}`}>
                <Quote className="text-theme-accent/5 group-hover:text-theme-accent/10 absolute -top-3 -right-3 h-16 w-16 transition-transform duration-500 group-hover:scale-110 sm:-top-4 sm:-right-4 sm:h-24 sm:w-24" />

                <div className="relative z-10">
                  <div className="mb-4 flex gap-1 sm:mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="fill-theme-accent text-theme-accent h-3.5 w-3.5 drop-shadow-[0_0_5px_var(--theme-accent)] sm:h-4 sm:w-4"
                      />
                    ))}
                  </div>
                  <p className="text-theme-muted text-sm leading-relaxed sm:text-base">
                    &ldquo;{t(`testimonials.list.${item.id}.quote`)}&rdquo;
                  </p>
                </div>

                <div className="border-theme-line relative z-10 mt-6 flex items-center gap-3 border-t pt-5 sm:mt-8 sm:gap-4 sm:pt-6">
                  <div className="border-theme-accent/30 bg-theme-surface relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] sm:h-12 sm:w-12">
                    <div className="border-theme-accent/10 absolute inset-1 rounded-full border" />
                    <span className="text-theme-accent-hover font-mono text-xs font-bold sm:text-sm">
                      {item.initials}
                    </span>
                  </div>
                  <div>
                    <div className="text-theme-fg text-sm font-bold">
                      {t(`testimonials.list.${item.id}.author`)}
                    </div>
                    <div className="text-theme-accent/70 mt-0.5 font-mono text-[9px] tracking-widest uppercase sm:text-[10px]">
                      {t(`testimonials.list.${item.id}.role`)}{' '}
                      <span className="text-theme-dim">{'//'}</span>{' '}
                      {t(`testimonials.list.${item.id}.company`)}
                    </div>
                  </div>
                </div>
              </TechCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400} className="mt-10 flex justify-center sm:mt-16">
          <InquiryModal type="review">
            <AppButton
              variant="ghost"
              size="lg"
              className="border-theme-accent/30 bg-theme-surface text-theme-accent hover:border-theme-accent/60 hover:bg-theme-accent/10 hover:text-theme-accent-hover border font-mono text-xs tracking-widest uppercase"
            >
              {t('testimonials.cta')}
            </AppButton>
          </InquiryModal>
        </Reveal>
      </div>
    </Section>
  );
};
