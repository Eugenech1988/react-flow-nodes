'use client';

import { Mail, ShieldAlert, Siren } from 'lucide-react';
import { AppButton, Reveal, Frame } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';

export const CareersCta = () => {
  const { t } = useT('careers');

  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 py-4 sm:px-6">
      <Reveal>
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--theme-danger)_15%,transparent),transparent_65%)] blur-2xl" />

        <Frame
          theme="careers"
          hasHazardStripes
          headerIcon={Siren}
          headerClassName="text-theme-danger"
          headerTitle="System Alert // Priority Red"
          footer={
            <div className="text-theme-dim flex w-full items-center justify-between font-mono text-[10px] tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <span className="bg-theme-danger h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_5px_var(--theme-danger)] motion-reduce:animate-none" />
                Awaiting Input
              </span>
              <span>SYS.READY</span>
            </div>
          }
        >
          <div className="relative px-6 py-10 sm:px-12 sm:py-14">
            <div className="font-typewriter border-theme-danger/30 text-theme-danger/30 absolute top-6 right-6 z-0 -rotate-12 rounded border-2 px-3 py-1 text-lg font-bold tracking-widest sm:top-10 sm:right-12 sm:text-2xl">
              CLASSIFIED
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-12">
              <div className="border-theme-danger/30 bg-theme-danger/5 relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border shadow-[inset_0_0_20px_color-mix(in_oklab,var(--theme-danger)_15%,transparent)] sm:h-32 sm:w-32">
                <div className="border-theme-danger/20 absolute inset-2 animate-[spin_10s_linear_infinite] rounded-full border border-dashed motion-reduce:animate-none" />
                <ShieldAlert
                  className="text-theme-danger/80 h-10 w-10 sm:h-14 sm:w-14"
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-typewriter text-theme-fg text-2xl font-bold tracking-tight uppercase sm:text-3xl md:text-4xl">
                  {t('cta.title')}
                </h2>

                <div className="border-theme-danger/50 mt-4 border-l-2 pl-4 sm:pl-5">
                  <p className="font-typewriter text-theme-muted text-sm leading-relaxed sm:text-base">
                    {t('cta.description')}
                  </p>
                </div>
              </div>
            </div>

            <div className="my-8 h-px w-full bg-[repeating-linear-gradient(90deg,var(--theme-line),var(--theme-line)_4px,transparent_4px,transparent_8px)]" />

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <InquiryModal theme="careers" type="contact">
                <AppButton variant="careers" size="lg" icon={Mail} className="w-full sm:w-auto">
                  {t('cta.primary')}
                </AppButton>
              </InquiryModal>

              <AppButton
                isLink
                linkTo="mailto:careers@example.com"
                variant="careers-outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                {t('cta.email')}
              </AppButton>
            </div>
          </div>
        </Frame>
      </Reveal>
    </section>
  );
};
