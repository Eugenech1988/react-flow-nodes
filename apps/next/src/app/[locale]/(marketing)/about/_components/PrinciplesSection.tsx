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
        <div className="border-theme-accent/10 pointer-events-none absolute top-12 right-10 left-10 hidden h-px border-t-2 border-dashed md:block" />

        {VALUES.map(({ id, Icon, number }, index) => (
          <Reveal key={id} delay={index * 150}>
            <TechCard className="bg-theme-surface/50 h-full justify-between p-5 sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--theme-accent)_6%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 transition-opacity group-hover:opacity-70" />

              <div className="border-theme-accent/10 relative z-10 mb-5 flex items-center justify-between border-b pb-3 sm:mb-6">
                <span className="text-theme-accent/70 font-mono text-[9px] font-bold tracking-widest uppercase sm:text-[10px]">
                  [Phase_{number}] // Briefing
                </span>
                <Target className="text-theme-accent/40 group-hover:text-theme-accent h-4 w-4 transition-colors" />
              </div>

              <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="border-theme-accent/30 bg-theme-accent/5 text-theme-accent group-hover:border-theme-accent/60 group-hover:bg-theme-accent/10 group-hover:text-theme-accent-hover flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-[inset_0_0_15px_color-mix(in_oklab,var(--theme-accent)_10%,transparent)] transition-all duration-300 sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6.5 sm:w-6.5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-theme-fg text-lg font-bold tracking-tight sm:text-xl">
                    {t(`values.list.${id}.title`)}
                  </h3>
                </div>

                <p className="text-theme-muted text-sm leading-relaxed">
                  {t(`values.list.${id}.description`)}
                </p>
              </div>

              <div className="border-theme-accent/10 relative z-10 mt-6 flex items-center justify-between border-t pt-4 sm:mt-8">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-theme-accent/60 h-3.5 w-3.5" />
                  <span className="text-theme-accent/50 font-mono text-[9px] tracking-widest uppercase">
                    Objective {number}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-theme-accent h-1.5 w-1.5 animate-pulse rounded-full" />
                  <span className="text-theme-accent/70 font-mono text-[9px] tracking-widest uppercase">
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
