import { SectionHeading } from '@/shared/ui';
import { getT } from '@/shared/lib/i18n/server';

export async function AboutHero() {
  const { t } = await getT('about');

  return (
    <section className="relative z-10 px-4 pt-28 pb-4 text-center sm:px-6 sm:pt-36 sm:pb-8 md:pt-40">
      <SectionHeading
        isMain
        title={t('hero.title')}
        description={t('hero.description')}
        titleClassName="text-4xl sm:text-5xl md:text-7xl drop-shadow-[0_0_30px_rgba(45,212,191,0.2)]"
      />
    </section>
  );
}
