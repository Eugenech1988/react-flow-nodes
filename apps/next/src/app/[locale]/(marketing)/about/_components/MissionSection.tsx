'use client';

import { Cog, Code2, Settings2 } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { Reveal } from '@/shared/ui';

export const MissionSection = () => {
  const { t } = useT('about');

  return (
    <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
      <Reveal animation="fade-left">
        <div className="mb-7 flex items-center justify-center gap-3 lg:justify-start">
          <span className="h-px w-10 bg-[#2dd4bf]/60" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#2dd4bf]/80 uppercase">
            Our Mission
          </span>
          <span className="font-mono text-[10px] text-[#2dd4bf]/40">/ 001</span>
        </div>

        <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl lg:mx-0 lg:text-left lg:text-5xl">
          {t('mission.title')}
        </h2>

        <p className="mx-auto mt-7 max-w-xl text-center text-base leading-8 text-slate-400 sm:text-lg lg:mx-0 lg:text-left">
          {t('mission.description')}
        </p>

        <div className="mt-9 flex items-center justify-center gap-4 lg:justify-start">
          <div className="relative h-1 w-16 shrink-0 overflow-hidden rounded-full bg-[#2dd4bf]/10">
            <div className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-[#2dd4bf] shadow-[0_0_12px_rgba(45,212,191,0.5)]" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#2dd4bf]/70 uppercase">
            Engineering with purpose
          </span>
        </div>
      </Reveal>

      <Reveal
        animation="fade-right"
        delay={150}
        className="relative mx-auto mt-10 w-full max-w-[16rem] sm:max-w-[22rem] lg:mt-0 lg:max-w-[26rem]"
      >
        <div className="relative flex aspect-square w-full items-center justify-center">
          <div className="absolute h-[88%] w-[88%] rounded-full border border-[#2dd4bf]/15" />
          <div className="absolute h-[76%] w-[76%] rounded-full border border-dashed border-[#2dd4bf]/20" />
          <div className="absolute h-[62%] w-[62%] rounded-full border border-[#2dd4bf]/15" />
          <div className="absolute h-[48%] w-[48%] rounded-full border border-[#2dd4bf]/20" />

          <div className="absolute top-[8%] left-1/2 h-[12%] w-px bg-[#2dd4bf]/30" />
          <div className="absolute bottom-[8%] left-1/2 h-[12%] w-px bg-[#2dd4bf]/30" />
          <div className="absolute top-1/2 left-[8%] h-px w-[12%] bg-[#2dd4bf]/30" />
          <div className="absolute top-1/2 right-[8%] h-px w-[12%] bg-[#2dd4bf]/30" />

          <div
            style={{ animation: 'spin 40s linear infinite' }}
            className="absolute top-[18%] left-[9%] flex h-12 w-12 items-center justify-center text-[#2dd4bf]/50 sm:h-16 sm:w-16"
          >
            <Cog className="h-full w-full" strokeWidth={0.8} />
          </div>
          <div
            style={{ animation: 'spin 32s linear infinite reverse' }}
            className="absolute right-[10%] bottom-[15%] flex h-14 w-14 items-center justify-center text-[#2dd4bf]/40 sm:h-20 sm:w-20"
          >
            <Settings2 className="h-full w-full" strokeWidth={0.8} />
          </div>

          <div className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-[#2dd4bf]/30 bg-[#07100f]/75 shadow-[0_0_50px_rgba(45,212,191,0.08),inset_0_0_30px_rgba(45,212,191,0.05)] sm:h-36 sm:w-36">
            <div className="absolute inset-2 rounded-full border border-dashed border-[#2dd4bf]/25" />
            <Code2 strokeWidth={1.3} className="h-8 w-8 text-[#5eead4] sm:h-10 sm:w-10" />
            <span className="mt-2 font-mono text-[8px] tracking-[0.2em] text-[#2dd4bf]/70 sm:mt-3 sm:text-[9px] sm:tracking-[0.25em]">
              CORE SYSTEM
            </span>
          </div>

          <div className="absolute top-1/2 left-0 hidden font-mono text-[9px] tracking-widest text-[#2dd4bf]/40 sm:block">
            X: 001
          </div>
          <div className="absolute top-1/2 right-0 hidden font-mono text-[9px] tracking-widest text-[#2dd4bf]/40 sm:block">
            Y: 002
          </div>
          <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-[8px] tracking-widest whitespace-nowrap text-[#2dd4bf]/60 uppercase sm:bottom-0 sm:text-[9px]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf]" />
            System operational
          </div>
        </div>
      </Reveal>
    </section>
  );
};
