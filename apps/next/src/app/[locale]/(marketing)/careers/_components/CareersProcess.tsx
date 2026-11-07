'use client';

import { m } from 'framer-motion';
import { Pin } from 'lucide-react';
import { SectionHeading } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { PROCESS_STEPS, CAREERS_CONTAINER, CAREERS_CARD } from '../constants';

const ROTATIONS = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1'];

export function CareersProcess() {
  const { t } = useT('careers');

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        title={t('process.heading.title')}
        description={t('process.heading.description')}
        isMain={false}
        gradientColors="from-[#9cc4b0] via-[#6fa28c] to-[#4a6d5e]"
        titleColor="text-[#d4cfc0]"
        descriptionColor="text-[#8a9488]"
      />

      <m.div
        variants={CAREERS_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mt-10 flex flex-col items-center gap-8 sm:mt-14 sm:gap-10"
      >
        {PROCESS_STEPS.map((step, i) => {
          const rotation = ROTATIONS[i % ROTATIONS.length];
          return (
            <m.div
              key={step.id}
              variants={CAREERS_CARD}
              whileHover={{ rotate: 0, scale: 1.02, transition: { duration: 0.2 } }}
              className={`relative w-full max-w-xl ${rotation}`}
              style={{ filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.55))' }}
            >
              <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#4a5c52] bg-linear-to-b from-[#9cc4b0] to-[#4a6d5e] shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]">
                  <Pin className="h-3.5 w-3.5 rotate-45 text-[#0a0e0d]" />
                </div>
              </div>

              <div className="relative overflow-hidden bg-[#f5f0e0] bg-[repeating-linear-gradient(transparent,transparent_27px,rgba(111,162,140,0.22)_27px,rgba(111,162,140,0.22)_28px)]">
                <div className="absolute top-4 left-3 h-3 w-3 rounded-full bg-[#0a0e0d] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                <div className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 rounded-full bg-[#0a0e0d] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                <div className="absolute bottom-4 left-3 h-3 w-3 rounded-full bg-[#0a0e0d] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />

                <div className="absolute top-0 bottom-0 left-10 w-px bg-[#c25a5a]/50 sm:left-12" />

                <div className="px-6 pt-6 pb-7 pl-14 sm:px-10 sm:pt-8 sm:pb-9 sm:pl-16">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="font-caveat text-xl text-[#8a7a5c]/70">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-[#8a7a5c]/70 uppercase">
                      {t('process.heading.badge')}
                    </span>
                  </div>

                  <h3 className="font-caveat text-3xl leading-tight font-bold text-[#1a2530] sm:text-4xl">
                    {t(`process.steps.${step.id}.title`)}
                  </h3>

                  <p className="font-caveat mt-2 text-xl leading-relaxed text-[#2a3540]/85 sm:text-2xl">
                    {t(`process.steps.${step.id}.description`)}
                  </p>

                  <svg className="mt-3 h-2 w-32 text-[#1a2530]/40" viewBox="0 0 120 8" aria-hidden>
                    <path
                      d="M 2 5 Q 30 2, 60 5 T 118 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(138,122,92,0.08),transparent_50%)]" />
              </div>
            </m.div>
          );
        })}
      </m.div>
    </section>
  );
}
