'use client';

import { Mail, ShieldAlert, Siren } from 'lucide-react';
import { AppButton, Reveal, TerminalPanel } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';

export function CareersCTA() {
  const { t } = useT('careers');

  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(194,90,90,0.15),transparent_65%)] blur-2xl" />

        <TerminalPanel
          hasHazardStripes
          headerIcon={Siren}
          headerClassName="text-[#c25a5a]"
          headerTitle="System Alert // Priority Red"
          footer={
            <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest text-[#4a5c52] uppercase">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c25a5a] shadow-[0_0_5px_#c25a5a]" />
                Awaiting Input
              </span>
              <span>SYS.READY</span>
            </div>
          }
        >
          <div className="relative px-6 py-10 sm:px-12 sm:py-14">
            <div className="font-typewriter absolute top-6 right-6 z-0 -rotate-12 rounded border-2 border-[#c25a5a]/30 px-3 py-1 text-lg font-bold tracking-widest text-[#c25a5a]/30 sm:top-10 sm:right-12 sm:text-2xl">
              CLASSIFIED
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-12">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-[#c25a5a]/30 bg-[#c25a5a]/5 shadow-[inset_0_0_20px_rgba(194,90,90,0.15)] sm:h-32 sm:w-32">
                <div className="absolute inset-2 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-[#c25a5a]/20" />
                <ShieldAlert
                  className="h-10 w-10 text-[#c25a5a]/80 sm:h-14 sm:w-14"
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-typewriter text-2xl font-bold tracking-tight text-[#d4cfc0] uppercase sm:text-3xl md:text-4xl">
                  {t('cta.title')}
                </h2>

                <div className="mt-4 border-l-2 border-[#c25a5a]/50 pl-4 sm:pl-5">
                  <p className="font-typewriter text-sm leading-relaxed text-[#8a9488] sm:text-base">
                    {t('cta.description')}
                  </p>
                </div>
              </div>
            </div>

            <div className="my-8 h-px w-full bg-[repeating-linear-gradient(90deg,#2f3d36,#2f3d36_4px,transparent_4px,transparent_8px)]" />

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <InquiryModal theme="steampunk" type="contact">
                <AppButton variant="steampunk" size="lg" icon={Mail} className="w-full sm:w-auto">
                  {t('cta.primary')}
                </AppButton>
              </InquiryModal>

              <AppButton
                isLink
                linkTo="mailto:careers@example.com"
                variant="steampunk-outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                {t('cta.email')}
              </AppButton>
            </div>
          </div>
        </TerminalPanel>
      </Reveal>
    </section>
  );
}
