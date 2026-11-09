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
            className="absolute z-20 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3a4842] shadow-[inset_0_1px_1px_rgba(156,196,176,0.25),inset_0_-1px_1px_rgba(0,0,0,0.7)]"
            style={{ top: `${r.top}%`, left: `${r.left}%` }}
          />
        ))}

        <div className="absolute inset-0 rounded-full border-2 border-[#4a5c52] bg-linear-to-br from-[#2a3630] via-[#141a16] to-[#0a0e0d] shadow-[inset_0_2px_10px_rgba(0,0,0,0.9),inset_0_-1px_2px_rgba(156,196,176,0.12),0_8px_20px_rgba(0,0,0,0.6),0_0_30px_rgba(111,162,140,0.15)]" />
        <div className="absolute inset-2.5 rounded-full border border-[#2f3d36] bg-[#0a0e0d] shadow-[inset_0_0_20px_rgba(0,0,0,0.95),inset_0_0_8px_rgba(111,162,140,0.08)]" />

        <svg className="absolute inset-2.5" viewBox="0 0 100 100" aria-hidden>
          <path
            d="M 15 65 A 40 40 0 0 1 85 65"
            fill="none"
            stroke="#6fa28c"
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
              stroke={tk.isMajor ? '#9cc4b0' : '#4a6d5e'}
              strokeWidth={tk.isMajor ? 1.4 : 0.7}
              opacity={tk.isMajor ? 0.9 : 0.6}
            />
          ))}
        </svg>

        <div className="gauge-needle absolute inset-0">
          <div
            className="absolute top-[14%] left-1/2 h-[36%] w-0.5 -translate-x-1/2 rounded-full bg-linear-to-t from-[#6fa28c] to-[#d4cfc0]"
            style={{ boxShadow: '0 0 4px rgba(156,196,176,0.55)' }}
          />
          <div className="absolute top-1/2 left-1/2 h-[9%] w-1 -translate-x-1/2 rounded-full bg-[#4a6d5e]" />
        </div>

        <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2f3d36] bg-linear-to-br from-[#9cc4b0] to-[#4a6d5e] shadow-[0_0_6px_rgba(156,196,176,0.6),inset_0_-1px_1px_rgba(0,0,0,0.5)]" />

        <div className="absolute inset-x-0 bottom-2.5 z-10 flex justify-center">
          <div className="rounded border border-[#4a5c52] bg-[#0f1512]/95 px-2 py-0.5 shadow-[inset_0_1px_0_rgba(156,196,176,0.15),0_2px_4px_rgba(0,0,0,0.5)]">
            <span className="gauge-value font-mono text-base leading-none font-bold text-[#9cc4b0]" />
          </div>
        </div>

        <span className="absolute top-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 animate-pulse rounded-full bg-[#9cc4b0] shadow-[0_0_6px_#9cc4b0]" />
      </div>

      <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-[#6fa28c] uppercase">
        {t('hero.badge.label')}
      </span>
    </div>
  );
};
