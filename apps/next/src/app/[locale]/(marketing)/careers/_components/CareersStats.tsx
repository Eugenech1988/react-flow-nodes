'use client';

import { useRef, useEffect } from 'react';
import { m, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useT } from '@/shared/lib/i18n/client';
import { CAREERS_STATS, CAREERS_CONTAINER, CAREERS_CARD } from '../constants';

const CHAMFER_OUTER =
  'polygon(16px 0,calc(100% - 16px) 0,100% 16px,100% calc(100% - 16px),calc(100% - 16px) 100%,16px 100%,0 calc(100% - 16px),0 16px)';
const CHAMFER_INNER =
  'polygon(15px 0,calc(100% - 15px) 0,100% 15px,100% calc(100% - 15px),calc(100% - 15px) 100%,15px 100%,0 calc(100% - 15px),0 15px)';

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 1.5, ease: 'easeOut' });
      return () => controls.stop();
    }
  }, [isInView, value, count]);

  return <m.span ref={ref}>{rounded}</m.span>;
}

export function CareersStats() {
  const { t } = useT('careers');

  return (
    <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <m.div
        variants={CAREERS_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5"
      >
        {CAREERS_STATS.map((stat) => {
          const Icon = stat.icon;
          const rawValue = t(`stats.list.${stat.id}.value`);
          const numericValue = parseInt(rawValue, 10) || 0;

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
                  className="relative overflow-hidden bg-linear-to-b from-[#141a16] to-[#0a0e0d] px-4 py-6 sm:px-5 sm:py-7"
                  style={{ clipPath: CHAMFER_INNER }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_2px,rgba(111,162,140,0.04)_2px,rgba(111,162,140,0.04)_3px)]" />

                  <div className="relative z-10 flex items-center justify-between">
                    <Icon className="h-4 w-4 text-[#6fa28c]" />
                    <span className="font-mono text-[8px] tracking-[0.25em] text-[#4a5c52] uppercase">
                      № {stat.id}
                    </span>
                  </div>

                  <div className="relative z-10 mt-4 font-serif text-3xl leading-none font-bold text-[#9cc4b0] [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_2px_1px_rgba(0,0,0,0.6),0_-1px_0_rgba(156,196,176,0.1)] sm:text-4xl">
                    <AnimatedNumber value={numericValue} />
                  </div>

                  <div className="relative z-10 mt-2 font-mono text-[9px] tracking-[0.2em] text-[#8a9488] uppercase sm:text-[10px]">
                    {t(`stats.list.${stat.id}.label`)}
                  </div>

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