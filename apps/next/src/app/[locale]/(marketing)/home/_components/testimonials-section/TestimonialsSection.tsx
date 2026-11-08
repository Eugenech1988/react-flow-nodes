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

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {TESTIMONIALS_DATA.map((item, index) => (
            <Reveal key={item.id} delay={index * 150}>
              <TechCard className={`h-full justify-between p-6 sm:p-8 ${item.rotation}`}>
                <Quote className="absolute -top-4 -right-4 h-24 w-24 text-[#2dd4bf]/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-[#2dd4bf]/10" />

                <div className="relative z-10">
                  <div className="mb-6 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-[#2dd4bf] text-[#2dd4bf] drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                    &ldquo;{t(`testimonials.list.${item.id}.quote`)}&rdquo;
                  </p>
                </div>

                <div className="relative z-10 mt-8 flex items-center gap-4 border-t border-slate-800/80 pt-6">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#2dd4bf]/30 bg-[#0a1210] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                    <div className="absolute inset-1 rounded-full border border-[#2dd4bf]/10" />
                    <span className="font-mono text-sm font-bold text-[#5eead4]">
                      {item.initials}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#d1faf5]">
                      {t(`testimonials.list.${item.id}.author`)}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] tracking-widest text-[#2dd4bf]/70 uppercase">
                      {t(`testimonials.list.${item.id}.role`)}{' '}
                      <span className="text-slate-600">{'//'}</span>{' '}
                      {t(`testimonials.list.${item.id}.company`)}
                    </div>
                  </div>
                </div>
              </TechCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400} className="mt-16 flex justify-center">
          <InquiryModal type="review">
            <AppButton
              variant="ghost"
              size="lg"
              className="border border-[#2dd4bf]/30 bg-[#0a1210] font-mono text-xs tracking-widest text-[#2dd4bf] uppercase hover:border-[#2dd4bf]/60 hover:bg-[#2dd4bf]/10 hover:text-[#5eead4]"
            >
              {t('testimonials.cta')}
            </AppButton>
          </InquiryModal>
        </Reveal>
      </div>
    </Section>
  );
};
