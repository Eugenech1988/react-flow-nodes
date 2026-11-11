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
      titleClassName="text-4xl sm:text-5xl md:text-7xl drop-shadow-[0_0_30px_rgba(45,212,191,0.25)]"
      gradientColors="from-[#e2e8f0] via-[#5eead4] to-[#2dd4bf]"
      titleColor="text-[#e2e8f0]"
      descriptionColor="text-[#94a3b8]"
    />

    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] font-bold tracking-[0.3em] text-[#2dd4bf] uppercase sm:gap-5">
      <span className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf] shadow-[0_0_6px_#2dd4bf]" />
        {t('hero.status')}
      </span>
      <span className="h-1 w-1 rounded-full bg-[#1E293B]" />
      <span>{t('hero.entries', { count: total })}</span>
      <span className="h-1 w-1 rounded-full bg-[#1E293B]" />
      <span>
        {t('hero.lastUpdate')}: {lastUpdate}
      </span>
    </div>
  </section>
);