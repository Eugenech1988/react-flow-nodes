'use client';

import { m } from 'framer-motion';
import { SectionHeading } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { PERKS, CAREERS_CONTAINER, CAREERS_CARD } from '../constants';

const ROTATIONS = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1'];

// Рваный низ: 28 точек
const TORN_BOTTOM =
  'polygon(0 0,100% 0,100% 94%,96% 100%,92% 94%,88% 100%,84% 94%,80% 100%,76% 94%,72% 100%,68% 94%,64% 100%,60% 94%,56% 100%,52% 94%,48% 100%,44% 94%,40% 100%,36% 94%,32% 100%,28% 94%,24% 100%,20% 94%,16% 100%,12% 94%,8% 100%,4% 94%,0 100%)';

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
      <m.div
        variants={CAREERS_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
      >
        {PERKS.map((perk, i) => {
          const Icon = perk.icon;
          const rotation = ROTATIONS[i % ROTATIONS.length];
          return (
            <m.div
              key={perk.id}
              variants={CAREERS_CARD}
              whileHover={{ rotate: 0, y: -4, transition: { duration: 0.2 } }}
              className={`relative ${rotation}`}
              style={{ filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.55))' }}
            >
              <div
                className="relative overflow-hidden bg-[#e8dcc8] text-[#2a2218]"
                style={{ clipPath: TORN_BOTTOM }}
              >
                {/* Кольца спирали сверху */}
                <div className="flex justify-around border-b border-dashed border-[#8a7a5c]/40 bg-[#d4c9b0] px-3 py-1.5">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <span
                      key={j}
                      className="h-1.5 w-1.5 rounded-full bg-[#4a3f2e] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                    />
                  ))}
                </div>

                {/* Тело листка */}
                <div className="px-5 pt-5 pb-8">
                  {/* «День» + иконка */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl leading-none font-bold text-[#8a2e2e]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[9px] tracking-[0.2em] text-[#8a7a5c] uppercase">
                        {t('perks.heading.badge')}
                      </span>
                    </div>
                    <Icon className="h-5 w-5 text-[#4a3f2e]/70" />
                  </div>

                  <h3 className="font-serif text-lg font-bold tracking-wide text-[#2a2218] sm:text-xl">
                    {t(`perks.list.${perk.id}.title`)}
                  </h3>
                  <p className="mt-2 font-serif text-sm leading-relaxed text-[#4a3f2e]/85">
                    {t(`perks.list.${perk.id}.description`)}
                  </p>
                </div>

                {/* Тёплый градиент — «старая бумага» */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(138,122,92,0.15),transparent_60%)]" />
              </div>
            </m.div>
          );
        })}
      </m.div>
    </section>
  );
}
