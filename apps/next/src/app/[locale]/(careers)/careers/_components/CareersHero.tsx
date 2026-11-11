import { SectionHeading } from '@/shared/ui';
import type { TFunction } from 'i18next';
import { CareersGauge } from './CareersGauge';

interface ICareersHeroProps {
  total: number;
  t: TFunction<'careers'>;
}

export const CareersHero = ({ total, t }: ICareersHeroProps) => {
  return (
    <section className="relative z-10 px-4 pt-24 text-center sm:px-6 sm:pt-28 md:pt-34">
      <SectionHeading
        isMain
        title={t('hero.title')}
        description={t('hero.description')}
        titleClassName="text-4xl sm:text-5xl md:text-7xl drop-shadow-[0_0_30px_rgba(111,162,140,0.25)]"
        className="sm:max-w-7xl md:max-w-7xl lg:max-w-7xl"
        gradientColors="from-[#9cc4b0] via-[#6fa28c] to-[#4a6d5e]"
        titleColor="text-[#d4cfc0]"
        descriptionColor="text-[#8a9488]"
      />

      <CareersGauge value={total} />
    </section>
  );
};
