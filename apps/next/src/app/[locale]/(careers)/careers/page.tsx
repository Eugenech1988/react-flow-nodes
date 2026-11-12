import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { TPageProps } from '@/shared/lib';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { getT } from '@/shared/lib/i18n/server';
import { getPublishedJobs } from '@/shared/api';
import {
  CareersHero,
  CareersStats,
  CareersConsole,
  CareersPerks,
  CareersProcess,
  CareersCta,
} from './_components';

export const generateMetadata = async ({ params }: TPageProps): Promise<Metadata> => {
  const { locale } = await params;
  return getPageMetadata(locale, 'careers', '/careers');
};

const CareersContent = async ({ locale }: { locale: string }) => {
  const [jobs, { t }] = await Promise.all([
    getPublishedJobs(locale),
    getT('careers', { lng: locale }),
  ]);

  return (
    <>
      <CareersHero total={jobs.length} t={t} />
      <CareersStats />
      <CareersConsole jobs={jobs} locale={locale} />
      <CareersPerks />
      <CareersProcess />
      <CareersCta />
    </>
  );
};

const CareersPage = async ({ params }: TPageProps) => {
  const { locale } = await params;

  return (
    <Suspense fallback={null}>
      <CareersContent locale={locale} />
    </Suspense>
  );
};

export default CareersPage;
