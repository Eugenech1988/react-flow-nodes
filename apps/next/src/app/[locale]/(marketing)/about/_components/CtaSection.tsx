'use client';

import { Activity, Gauge, RadioTower, Radio } from 'lucide-react';
import { AppButton, MonitorFrame, Reveal } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';

const SIGNAL_BARS = [40, 60, 80, 100, 70];

export const CtaSection = () => {
  const { t, i18n } = useT('about');
  const lng = i18n.language;

  return (
    <>
      <Reveal className="relative pb-10">
        <MonitorFrame
          headerIcon={Activity}
          headerTitle={
            <>
              <span className="hidden sm:inline">SYS.WORKSPACE // COMM.LINK // CH-01</span>
              <span className="sm:hidden">COMM.LINK // CH-01</span>
            </>
          }
          footer={
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500 sm:text-[10px]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf]" />
                LINK READY
              </div>

              <div className="flex items-center gap-3 sm:gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex w-10 flex-col items-center sm:w-14">
                    <Gauge className="h-3.5 w-3.5 text-slate-500 sm:h-4 sm:w-4" />
                    <div className="mt-1 h-1 w-full rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-slate-600"
                        style={{ animation: `pulse-width ${3 + i}s ease-in-out infinite` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
          className="shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(45,212,191,0.1)]"
        >
          <div className="relative overflow-hidden px-5 py-10 sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_1px,transparent_1.5px)] bg-size-[16px_16px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(45,212,191,0.07),transparent_55%)]" />

            <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-14">
              <div className="text-center md:text-left">
                <div className="mb-5 inline-flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2dd4bf] opacity-40" />
                    <span className="relative h-2 w-2 rounded-full bg-[#2dd4bf]" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-[#2dd4bf]/80 uppercase">
                    Channel open
                  </span>
                </div>

                <h2 className="max-w-xl text-2xl font-bold tracking-tight text-[#d1faf5] sm:text-3xl md:text-4xl">
                  {t('cta.title')}
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base md:mx-0">
                  {t('cta.description')}
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
                  <span className="absolute inset-0 animate-ping rounded-full border border-[#2dd4bf]/30 motion-reduce:animate-none" />
                  <span
                    className="absolute inset-4 animate-ping rounded-full border border-[#2dd4bf]/30 motion-reduce:animate-none"
                    style={{ animationDelay: '0.6s' }}
                  />
                  <span
                    className="absolute inset-8 animate-ping rounded-full border border-[#2dd4bf]/30 motion-reduce:animate-none"
                    style={{ animationDelay: '1.2s' }}
                  />

                  <div className="absolute inset-0 rounded-full border border-slate-700 bg-slate-900/80 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]" />
                  <div className="absolute inset-2 animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-[#2dd4bf]/30" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#2dd4bf]/50 bg-[#0a1210] shadow-[0_0_30px_rgba(45,212,191,0.25),inset_0_0_20px_rgba(0,0,0,0.9)] sm:h-24 sm:w-24">
                    <RadioTower className="h-9 w-9 text-[#5eead4] drop-shadow-[0_0_10px_#2dd4bf] sm:h-10 sm:w-10" />
                  </div>
                </div>

                <div className="flex w-full max-w-xs flex-col items-center gap-3">
                  <div className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-[#040a09] px-4 py-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)]">
                    <span className="font-mono text-[9px] tracking-widest text-slate-500">
                      FREQ
                    </span>
                    <span className="font-mono text-sm font-bold tracking-widest text-[#5eead4] drop-shadow-[0_0_6px_#2dd4bf]">
                      144.250
                    </span>
                    <span className="font-mono text-[9px] tracking-widest text-slate-500">MHz</span>
                  </div>

                  <div className="flex h-5 items-end gap-1">
                    {SIGNAL_BARS.map((height, i) => (
                      <span
                        key={i}
                        className="w-1.5 animate-pulse rounded-sm bg-[#2dd4bf]/70 motion-reduce:animate-none"
                        style={{ height: `${height}%`, animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>

                <AppButton
                  isLink
                  linkTo={`/${lng}/careers`}
                  variant="primary"
                  size="lg"
                  icon={Radio}
                  className="w-full max-w-xs"
                >
                  {t('cta.button')}
                </AppButton>
              </div>
            </div>
          </div>
        </MonitorFrame>
      </Reveal>

    </>
  );
};
