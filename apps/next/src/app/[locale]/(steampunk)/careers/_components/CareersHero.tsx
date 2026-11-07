import { SectionHeading } from '@/shared/ui';
import { getT } from '@/shared/lib/i18n/server';
import { CareersGauge } from './CareersGauge';

export async function CareersHero() {
  const { t } = await getT('careers');

  return (
    <section className="relative z-10 px-4 pt-28 pb-4 text-center sm:px-6 sm:pt-36 sm:pb-8 md:pt-40">
      <SectionHeading
        isMain
        title={t('hero.title')}
        description={t('hero.description')}
        titleClassName="text-4xl sm:text-5xl md:text-7xl drop-shadow-[0_0_30px_rgba(111,162,140,0.25)]"
        gradientColors="from-[#9cc4b0] via-[#6fa28c] to-[#4a6d5e]"
        titleColor="text-[#d4cfc0]"
        descriptionColor="text-[#8a9488]"
      />

      <CareersGauge />
    </section>
  );
}
