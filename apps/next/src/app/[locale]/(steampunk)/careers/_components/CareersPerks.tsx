'use client';

import { SectionHeading, TornPaperCard, Reveal } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { PERKS } from '../constants';

const ROTATIONS = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1'];

export function CareersPerks() {
  const { t } = useT('careers');

  return (
    <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionHeading
        title={t('perks.heading.title')}
        description={t('perks.heading.description')}
        isMain={false}
        gradientColors="from-[#9cc4b0] via-[#6fa28c] to-[#4a6d5e]"
        titleColor="text-[#d4cfc0]"
        descriptionColor="text-[#8a9488]"
      />

      <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {PERKS.map((perk, i) => {
          const Icon = perk.icon;
          const rotation = ROTATIONS[i % ROTATIONS.length];

          return (
            <Reveal key={perk.id} delay={i * 120}>
              <div
                className={`group relative transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-0 ${rotation}`}
                style={{ filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.55))' }}
              >
                <TornPaperCard
                  title={t(`perks.list.${perk.id}.title`)}
                  description={t(`perks.list.${perk.id}.description`)}
                  number={String(i + 1).padStart(2, '0')}
                  Icon={Icon}
                  badge={t('perks.heading.badge')}
                />
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}