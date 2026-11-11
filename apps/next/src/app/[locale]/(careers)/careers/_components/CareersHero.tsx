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
        titleClassName="text-4xl sm:text-5xl md:text-7xl drop-shadow-[0_0_30px_color-mix(in_oklab,var(--theme-accent)_25%,transparent)]"
        className="sm:max-w-7xl md:max-w-7xl lg:max-w-7xl"
        gradientColors="from-theme-accent-hover via-theme-accent to-theme-accent-deep"
        titleColor="text-theme-fg"
        descriptionColor="text-theme-muted"
      />

      <CareersGauge value={total} />
    </section>
  );
};
