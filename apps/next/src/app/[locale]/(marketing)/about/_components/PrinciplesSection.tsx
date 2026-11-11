'use client';

import { AlertTriangle, Target } from 'lucide-react';
import { SectionHeading, Reveal, TechCard } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { VALUES } from './constants';

export const PrinciplesSection = () => {
  const { t } = useT('about');

  return (
    <section className="mb-16 md:mb-20">
      <SectionHeading
        title={t('values.title')}
        description={t('values.description')}
        isMain={false}
      />

      <div className="relative mt-10 grid grid-cols-1 gap-5 sm:mt-16 sm:gap-6 md:grid-cols-3">
        <div className="pointer-events-none absolute top-12 right-10 left-10 hidden h-px border-t-2 border-dashed border-[#2dd4bf]/10 md:block" />

        {VALUES.map(({ id, Icon, number }, index) => (
          <Reveal key={id} delay={index * 150}>
            <TechCard className="h-full justify-between bg-[#0a1210]/50 p-5 sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.06)_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 transition-opacity group-hover:opacity-70" />

              <div className="relative z-10 mb-5 flex items-center justify-between border-b border-[#2dd4bf]/10 pb-3 sm:mb-6">
                <span className="font-mono text-[9px] font-bold tracking-widest text-[#2dd4bf]/70 uppercase sm:text-[10px]">
                  [Phase_{number}] // Briefing
                </span>
                <Target className="h-4 w-4 text-[#2dd4bf]/40 transition-colors group-hover:text-[#2dd4bf]" />
              </div>

              <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#2dd4bf]/30 bg-[#2dd4bf]/5 text-[#2dd4bf] shadow-[inset_0_0_15px_rgba(45,212,191,0.1)] transition-all duration-300 group-hover:border-[#2dd4bf]/60 group-hover:bg-[#2dd4bf]/10 group-hover:text-[#5eead4] sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6.5 sm:w-6.5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-[#d1faf5] sm:text-xl">
                    {t(`values.list.${id}.title`)}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-slate-400">
                  {t(`values.list.${id}.description`)}
                </p>
              </div>

              <div className="relative z-10 mt-6 flex items-center justify-between border-t border-[#2dd4bf]/10 pt-4 sm:mt-8">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#2dd4bf]/60" />
                  <span className="font-mono text-[9px] tracking-widest text-[#2dd4bf]/50 uppercase">
                    Objective {number}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf]" />
                  <span className="font-mono text-[9px] tracking-widest text-[#2dd4bf]/70 uppercase">
                    Cleared
                  </span>
                </div>
              </div>
            </TechCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
