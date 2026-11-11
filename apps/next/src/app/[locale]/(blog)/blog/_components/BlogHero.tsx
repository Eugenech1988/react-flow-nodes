import { SectionHeading } from '@/shared/ui';
import type { TFunction } from 'i18next';

interface IBlogHeroProps {
  t: TFunction<'blog'>;
  total: number;
  lastUpdate: string;
}

export const BlogHero = ({ t, total, lastUpdate }: IBlogHeroProps) => (
  <section className="relative z-10 px-4 pt-24 pb-8 text-center sm:px-6 sm:pt-28 sm:pb-12 md:pt-34">
    <SectionHeading
      isMain
      title={t('hero.title')}
      description={t('hero.description')}
      titleClassName="text-4xl sm:text-5xl md:text-7xl drop-shadow-[0_0_30px_color-mix(in_oklab,var(--theme-accent)_25%,transparent)]"
      gradientColors="from-theme-fg via-theme-accent-hover to-theme-accent"
      titleColor="text-theme-fg"
      descriptionColor="text-theme-muted"
    />

    <div className="text-theme-accent mt-8 flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] font-bold tracking-[0.3em] uppercase sm:gap-5">
      <span className="flex items-center gap-2">
        <span className="bg-theme-accent h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_6px_var(--theme-accent)]" />
        {t('hero.status')}
      </span>
      <span className="bg-theme-line h-1 w-1 rounded-full" />
      <span>{t('hero.entries', { count: total })}</span>
      <span className="bg-theme-line h-1 w-1 rounded-full" />
      <span>
        {t('hero.lastUpdate')}: {lastUpdate}
      </span>
    </div>
  </section>
);
