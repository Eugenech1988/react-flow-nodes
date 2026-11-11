'use client';

import { SectionHeading, Reveal } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { PROCESS_STEPS } from '../constants';
import { StickyNoteCard } from '@/widgets/careers-ui';

const ROTATIONS = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1'];

export const CareersProcess = () => {
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

      <div className="mt-10 flex flex-col items-center gap-8 sm:mt-14 sm:gap-10">
        {PROCESS_STEPS.map((step, i) => {
          const rotation = ROTATIONS[i % ROTATIONS.length];
          return (
            <Reveal key={step.id} delay={i * 120} className="w-full max-w-xl">
              <div
                className={`group relative transition-transform duration-300 ease-out hover:scale-[1.02] hover:rotate-0 ${rotation}`}
                style={{ filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.55))' }}
              >
                <StickyNoteCard
                  title={t(`process.steps.${step.id}.title`)}
                  description={t(`process.steps.${step.id}.description`)}
                  number={String(i + 1).padStart(2, '0')}
                />
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};
