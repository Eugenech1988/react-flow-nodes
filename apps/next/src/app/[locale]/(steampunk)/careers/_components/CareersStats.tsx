'use client';

import { m } from 'framer-motion';
import { useT } from '@/shared/lib/i18n/client';
import { CAREERS_STATS, CAREERS_CONTAINER, CAREERS_CARD } from '../constants';
import { Odometer } from './CareersOdometer';

const CHAMFER_OUTER =
  'polygon(16px 0,calc(100% - 16px) 0,100% 16px,100% calc(100% - 16px),calc(100% - 16px) 100%,16px 100%,0 calc(100% - 16px),0 16px)';
const CHAMFER_INNER =
  'polygon(15px 0,calc(100% - 15px) 0,100% 15px,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 calc(100% - 15px),0 15px)';

export function CareersStats() {
  const { t } = useT('careers');

  return (
    <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <m.div
        variants={CAREERS_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-2 items-start gap-3 sm:grid-cols-4 sm:gap-5"
      >
        {CAREERS_STATS.map((stat) => {
          const Icon = stat.icon;
          const value = t(`stats.list.${stat.id}.value`);

          return (
            <m.div
              key={stat.id}
              variants={CAREERS_CARD}
              className="relative"
              style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }}
            >
              <div
                className="bg-linear-to-b from-[#4a5c52] via-[#2f3d36] to-[#1a2420] p-px"
                style={{ clipPath: CHAMFER_OUTER }}
              >
                <div
                  className="relative flex flex-col items-center justify-center overflow-hidden bg-linear-to-b from-[#141a16] to-[#0a0e0d] px-4 py-6 sm:py-7"
                  style={{ clipPath: CHAMFER_INNER }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_2px,rgba(111,162,140,0.04)_2px,rgba(111,162,140,0.04)_3px)]" />

                  {/* Центральный блок с числом */}
                  <div className="relative z-10 flex h-14 w-full items-center justify-center rounded-md border border-[#2f3d36] bg-[#0a0e0d]/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                    {/* Винтики по краям */}
                    <div className="absolute top-1/2 left-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#3a4842] shadow-[inset_0_1px_2px_rgba(156,196,176,0.3),0_1px_1px_rgba(0,0,0,0.8)]" />
                    <div className="absolute top-1/2 right-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#3a4842] shadow-[inset_0_1px_2px_rgba(156,196,176,0.3),0_1px_1px_rgba(0,0,0,0.8)]" />

                    <div className="text-3xl sm:text-4xl">
                      <Odometer value={value} />
                    </div>
                  </div>

                  {/* Подвал: Иконка + Подпись */}
                  <div className="relative z-10 mt-4 flex w-full items-center justify-center gap-2">
                    <Icon className="h-5 w-5 text-[#6fa28c] drop-shadow-[0_0_8px_rgba(111,162,140,0.4)] sm:h-6 sm:w-6" />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#8a9488] uppercase sm:text-xs">
                      {t(`stats.list.${stat.id}.label`)}
                    </span>
                  </div>

                  {/* Уголки и подсветка */}
                  <div className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t border-r border-dashed border-[#6fa28c]/40" />
                  <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-dashed border-[#6fa28c]/40" />
                  <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-[#9cc4b0]/30 to-transparent" />
                </div>
              </div>
            </m.div>
          );
        })}
      </m.div>
    </section>
  );
}
