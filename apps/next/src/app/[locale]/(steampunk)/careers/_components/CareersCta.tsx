'use client';

import { Mail, ShieldAlert, Siren } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { CareersInquiryModal } from '@/features';
import { useInView } from '@/shared/hooks';

export function CareersCTA() {
  const { t } = useT('careers');
  const { ref: sectionRef, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <div
        ref={sectionRef}
        className={`relative ${
          inView
            ? 'animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
            : 'opacity-0'
        }`}
        style={{ animationFillMode: 'both' }}
      >
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(194,90,90,0.15),transparent_65%)] blur-2xl" />

        <div className="relative overflow-hidden rounded-2xl border-2 border-[#4a5c52] bg-linear-to-b from-[#1a2420] to-[#0f1512] p-3 shadow-[inset_0_1px_0_rgba(156,196,176,0.15),0_20px_50px_rgba(0,0,0,0.8)] sm:rounded-3xl sm:p-4">
          {(['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'] as const).map(
            (pos) => (
              <span
                key={pos}
                className={`absolute ${pos} z-20 h-2 w-2 rounded-full bg-[#3a4842] shadow-[inset_0_1px_1px_rgba(156,196,176,0.25),inset_0_-1px_1px_rgba(0,0,0,0.8)]`}
              />
            ),
          )}

          <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#2f3d36] bg-[#0a0e0d] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),inset_0_0_8px_rgba(111,162,140,0.1)]">
            <div className="h-2 w-full bg-[repeating-linear-gradient(-45deg,#8a2e2e,#8a2e2e_10px,#0a0e0d_10px,#0a0e0d_20px)] opacity-80" />

            <div className="pointer-events-none absolute inset-0 z-20 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,rgba(111,162,140,0.03)_2px,rgba(111,162,140,0.03)_3px)]" />
            <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

            <div className="relative z-10 flex items-center justify-between border-b border-[#2f3d36] bg-[#0f1512]/80 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-[#c25a5a] uppercase sm:text-xs">
                <Siren className="h-4 w-4 animate-pulse" />
                <span>System Alert // Priority Red</span>
              </div>
              <div className="hidden font-mono text-[10px] text-[#4a5c52] sm:block">
                REF: #4092-A
              </div>
            </div>

            <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14">
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
                <CareersInquiryModal type="contact">
                  <AppButton variant="steampunk" size="lg" icon={Mail} className="w-full sm:w-auto">
                    {t('cta.primary')}
                  </AppButton>
                </CareersInquiryModal>

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

            <div className="relative z-10 flex items-center justify-between border-t border-[#2f3d36] bg-[#0f1512]/80 px-4 py-2 font-mono text-[10px] tracking-widest text-[#4a5c52] uppercase">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c25a5a] shadow-[0_0_5px_#c25a5a]" />
                Awaiting Input
              </span>
              <span>SYS.READY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
