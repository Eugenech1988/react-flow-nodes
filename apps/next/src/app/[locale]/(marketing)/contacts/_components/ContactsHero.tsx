import { SectionHeading } from '@/shared/ui';
import { getT } from '@/shared/lib/i18n/server';

export const ContactsHero = async () => {
  const { t } = await getT('contacts');

  return (
    <section className="relative z-10 px-4 pt-24 pb-8 text-center sm:px-6 sm:pt-28 sm:pb-12 md:pt-34">
      <SectionHeading
        isMain
        title={t('hero.title', { defaultValue: 'Establish Connection' })}
        description={t('hero.description', {
          defaultValue:
            'Open a secure channel with our command center. Whether you need technical support, sales inquiries, or just want to say hi.',
        })}
        titleClassName="text-3xl sm:text-5xl md:text-6xl drop-shadow-[0_0_30px_rgba(45,212,191,0.25)]"
      />
    </section>
  );
};
