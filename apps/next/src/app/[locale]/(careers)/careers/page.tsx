import type { Metadata } from 'next';
import type { TPageProps } from '@/shared/lib';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { getT } from '@/shared/lib/i18n/server';
import { SteampunkBackground } from '@/shared/ui';
import { getPublishedJobs } from '@/shared/api';
import {
  CareersHero,
  CareersStats,
  CareersConsole,
  CareersPerks,
  CareersProcess,
  CareersCTA,
} from './_components';

export const generateMetadata = async ({ params }: TPageProps): Promise<Metadata> => {
  const { locale } = await params;
  return getPageMetadata(locale, 'careers', '/careers');
};

const CareersPage = async ({ params }: TPageProps) => {
  const { locale } = await params;

  const [jobs, { t }] = await Promise.all([
    getPublishedJobs(locale),
    getT('careers', { lng: locale }),
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0e0d] text-[#d4cfc0]">
      <SteampunkBackground />
      <CareersHero total={jobs.length} t={t} />
      <CareersStats />
      <CareersConsole jobs={jobs} locale={locale} />
      <CareersPerks />
      <CareersProcess />
      <CareersCTA />
    </div>
  );
};

export default CareersPage;
