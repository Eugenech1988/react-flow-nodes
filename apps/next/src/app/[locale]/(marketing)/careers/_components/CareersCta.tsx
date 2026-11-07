'use client';

import { m } from 'framer-motion';
import { Mail, ShieldAlert, Siren } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';

export function CareersCTA() {
  const { t } = useT('careers');

  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <m.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rotate-1"
        style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.7))' }}
      >
        <div className="absolute -top-3 -left-6 z-20 h-8 w-24 -rotate-45 bg-[#d4cfc0]/40 backdrop-blur-sm shadow-sm mix-blend-overlay" />
        <div className="absolute -right-6 -bottom-3 z-20 h-8 w-24 -rotate-45 bg-[#d4cfc0]/40 backdrop-blur-sm shadow-sm mix-blend-overlay" />

        <div className="relative overflow-hidden rounded-sm border-2 border-[#8a7a5c]/50 bg-[#e8dcc8] text-[#2a2218]">

          <div className="h-4 w-full bg-[repeating-linear-gradient(-45deg,#c25a5a,#c25a5a_10px,#e8dcc8_10px,#e8dcc8_20px)] opacity-80" />

          <div className="flex items-center justify-between border-b-2 border-[#2a2218]/20 px-4 py-3 sm:px-8">
            <div className="flex items-center gap-2 font-typewriter text-[10px] font-bold tracking-widest text-[#2a2218]/70 uppercase sm:text-xs">
              <Siren className="h-4 w-4 animate-pulse text-[#c25a5a]" />
              <span>FIELD MEMO // URGENT</span>
            </div>
            <div className="hidden font-typewriter text-[10px] text-[#2a2218]/50 sm:block">
              REF: #4092-A
            </div>
          </div>

          <div className="relative px-6 py-8 sm:px-12 sm:py-10">
            <div className="absolute top-8 right-4 z-10 -rotate-12 rounded border-4 border-[#c25a5a]/60 px-3 py-1 font-typewriter text-lg font-bold tracking-widest text-[#c25a5a]/60 opacity-80 mix-blend-multiply sm:top-12 sm:right-12 sm:text-2xl">
              CLASSIFIED
            </div>

            <div className="relative z-0 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#2a2218]/30 bg-[#2a2218]/5 sm:h-32 sm:w-32">
                <ShieldAlert className="h-12 w-12 text-[#2a2218]/70 sm:h-16 sm:w-16" strokeWidth={1.5} />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-typewriter text-xl font-bold uppercase tracking-tight text-[#2a2218] sm:text-2xl md:text-3xl">
                  {t('cta.title')}
                </h2>

                <div className="mt-4 border-l-4 border-[#c25a5a]/40 pl-4 sm:pl-5">
                  <p className="font-typewriter text-sm leading-relaxed text-[#4a3f2e] sm:text-base">
                    {t('cta.description')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 border-t-2 border-dashed border-[#2a2218]/20 pt-8 sm:flex-row">
              <InquiryModal type="contact">
                <AppButton
                  variant="ghost"
                  size="lg"
                  icon={Mail}
                  className="w-full rounded-none border-2 border-[#2a2218] bg-[#2a2218] font-typewriter text-xs uppercase tracking-widest text-[#e8dcc8] transition-transform hover:-translate-y-1 hover:bg-[#1a1510] sm:w-auto"
                >
                  {t('cta.primary')}
                </AppButton>
              </InquiryModal>

              <AppButton
                isLink
                linkTo="mailto:careers@example.com"
                variant="ghost"
                size="lg"
                className="w-full rounded-none border-2 border-[#2a2218]/50 bg-transparent font-typewriter text-xs uppercase tracking-widest text-[#2a2218] transition-transform hover:-translate-y-1 hover:border-[#2a2218] hover:bg-[#2a2218]/5 sm:w-auto"
              >
                {t('cta.email')}
              </AppButton>
            </div>
          </div>

          <div className="flex h-8 items-end justify-center gap-0.5 pb-2 opacity-30">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#2a2218]"
                style={{
                  width: `${(i % 3) + 1}px`,
                  height: `${(i % 5) * 2 + 4}px`
                }}
              />
            ))}
          </div>
        </div>
      </m.div>
    </section>
  );
}