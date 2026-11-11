'use client';

import { useT } from '@/shared/lib/i18n/client';
import { MAX_VACANCIES, RIVETS, TICKS } from '../constants';

interface ICareersGaugeProps {
  value: number;
}

export const CareersGauge = ({ value }: ICareersGaugeProps) => {
  const { t } = useT('careers');

  const ratio = MAX_VACANCIES > 0 ? Math.min(1, value / MAX_VACANCIES) : 0;
  const targetAngle = -135 + ratio * 270;
  const isReady = value > 0;

  return (
    <div
      className={`careers-gauge ${isReady ? 'is-active' : ''} mx-auto mt-8 flex flex-col items-center gap-2`}
      style={
        {
          '--target-angle': `${targetAngle}deg`,
          '--target-value': value,
        } as React.CSSProperties
      }
    >
      <div className="relative h-32 w-32 sm:h-36 sm:w-36">
        {RIVETS.map((r) => (
          <span
            key={r.deg}
            className="bg-theme-rivet absolute z-20 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[inset_0_1px_1px_color-mix(in_oklab,var(--theme-accent-hover)_25%,transparent),inset_0_-1px_1px_rgba(0,0,0,0.7)]"
            style={{ top: `${r.top}%`, left: `${r.left}%` }}
          />
        ))}

        <div className="border-theme-line from-theme-surface via-theme-bg to-theme-bg absolute inset-0 rounded-full border-2 bg-linear-to-br shadow-[inset_0_2px_10px_rgba(0,0,0,0.9),inset_0_-1px_2px_color-mix(in_oklab,var(--theme-accent-hover)_12%,transparent),0_8px_20px_rgba(0,0,0,0.6),0_0_30px_color-mix(in_oklab,var(--theme-accent)_15%,transparent)]" />
        <div className="border-theme-line-strong bg-theme-bg absolute inset-2.5 rounded-full border shadow-[inset_0_0_20px_rgba(0,0,0,0.95),inset_0_0_8px_color-mix(in_oklab,var(--theme-accent)_8%,transparent)]" />

        <svg className="absolute inset-2.5" viewBox="0 0 100 100" aria-hidden>
          <path
            d="M 15 65 A 40 40 0 0 1 85 65"
            fill="none"
            stroke="var(--theme-accent)"
            strokeWidth="2.5"
            opacity="0.35"
          />
        </svg>

        <svg className="absolute inset-2.5" viewBox="0 0 100 100" aria-hidden>
          {TICKS.map((tk) => (
            <line
              key={tk.i}
              x1={tk.x1}
              y1={tk.y1}
              x2={tk.x2}
              y2={tk.y2}
              stroke={tk.isMajor ? 'var(--theme-accent-hover)' : 'var(--theme-accent-deep)'}
              strokeWidth={tk.isMajor ? 1.4 : 0.7}
              opacity={tk.isMajor ? 0.9 : 0.6}
            />
          ))}
        </svg>

        <div className="gauge-needle absolute inset-0">
          <div
            className="from-theme-accent to-theme-fg absolute top-[14%] left-1/2 h-[36%] w-0.5 -translate-x-1/2 rounded-full bg-linear-to-t"
            style={{
              boxShadow: '0 0 4px color-mix(in oklab, var(--theme-accent-hover) 55%, transparent)',
            }}
          />
          <div className="bg-theme-accent-deep absolute top-1/2 left-1/2 h-[9%] w-1 -translate-x-1/2 rounded-full" />
        </div>

        <div className="border-theme-line-strong from-theme-accent-hover to-theme-accent-deep absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-linear-to-br shadow-[0_0_6px_color-mix(in_oklab,var(--theme-accent-hover)_60%,transparent),inset_0_-1px_1px_rgba(0,0,0,0.5)]" />

        <div className="absolute inset-x-0 bottom-2.5 z-10 flex justify-center">
          <div className="border-theme-line bg-theme-surface/95 rounded border px-2 py-0.5 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent-hover)_15%,transparent),0_2px_4px_rgba(0,0,0,0.5)]">
            <span className="gauge-value text-theme-accent-hover font-mono text-base leading-none font-bold" />
          </div>
        </div>

        <span className="bg-theme-accent-hover absolute top-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 animate-pulse rounded-full shadow-[0_0_6px_var(--theme-accent-hover)]" />
      </div>

      <span className="text-theme-accent font-mono text-[9px] font-bold tracking-[0.25em] uppercase">
        {t('hero.badge.label')}
      </span>
    </div>
  );
};
