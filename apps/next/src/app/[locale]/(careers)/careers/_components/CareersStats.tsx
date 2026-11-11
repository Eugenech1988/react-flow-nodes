'use client';

import { useT } from '@/shared/lib/i18n/client';
import { CAREERS_STATS } from '../constants';
import { Odometer } from './CareersOdometer';
import { ChamferedCard } from '@/shared/ui';

export function CareersStats() {
  const { t } = useT('careers');

  return (
    <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-4 sm:gap-5">
        {CAREERS_STATS.map((stat) => {
          const Icon = stat.icon;
          const value = t(`stats.list.${stat.id}.value`);

          return (
            <div key={stat.id}>
              <ChamferedCard>
                <div className="flex h-14 w-full items-center justify-center rounded-md border border-theme-line bg-theme-surface/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                  <div className="absolute top-1/2 left-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-theme-rivet shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--theme-accent-hover)_30%,transparent),0_1px_1px_rgba(0,0,0,0.8)]" />
                  <div className="absolute top-1/2 right-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-theme-rivet shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--theme-accent-hover)_30%,transparent),0_1px_1px_rgba(0,0,0,0.8)]" />

                  <div className="text-3xl sm:text-4xl">
                    <Odometer value={value} />
                  </div>
                </div>

                <div className="mt-4 flex w-full items-center justify-center gap-2">
                  <Icon className="h-5 w-5 text-theme-accent drop-shadow-[0_0_8px_color-mix(in_oklab,var(--theme-accent)_40%,transparent)] sm:h-6 sm:w-6" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-theme-muted uppercase sm:text-xs">
                    {t(`stats.list.${stat.id}.label`)}
                  </span>
                </div>
              </ChamferedCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}
