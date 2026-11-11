import type { Metadata } from 'next';
import { Suspense } from 'react';
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

type PageProps = { params: Promise<{ locale: string }> };

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { locale } = await params;
  return getPageMetadata(locale, 'careers', '/careers');
};

const CareersSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="mx-auto mt-36 max-w-5xl space-y-6 px-4">
        <div className="mx-auto h-16 w-3/4 rounded-2xl bg-white/5" />
        <div className="mx-auto h-4 w-1/2 rounded-xl bg-white/5" />
        <div className="mx-auto h-36 w-36 rounded-full bg-white/5" />
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white/5" />
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-5xl px-4">
        <div className="h-100 rounded-2xl bg-white/5" />
      </div>
    </div>
  );
};

const CareersData = async ({ locale }: { locale: string }) => {
  const [jobs, { t }] = await Promise.all([
    getPublishedJobs(locale),
    getT('careers', { lng: locale }),
  ]);

  return (
    <>
      <CareersHero total={jobs.length} t={t} />
      <CareersStats />
      <CareersConsole jobs={jobs} locale={locale} />
    </>
  );
};

export default async function CareersPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0e0d] text-[#d4cfc0]">
      <SteampunkBackground />

      <Suspense fallback={<CareersSkeleton />}>
        <CareersData locale={locale} />
      </Suspense>

      <CareersPerks />
      <CareersProcess />
      <CareersCTA />
    </div>
  );
}
