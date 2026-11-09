import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { JOBS } from '../constants';
import { JobDetailView } from './_components';
import { Suspense } from 'react';
import { getT } from '@/shared/lib/i18n/server';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateStaticParams() {
  const locales = ['en', 'ua'];
  return locales.flatMap((locale) => JOBS.map((job) => ({ locale, id: job.id })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const job = JOBS.find((j) => j.id === id);

  if (!job) return {};

  const { t } = await getT('careers', { lng: locale });

  return getPageMetadata(locale, 'careers', `/careers/${id}`, {
    title: t(`details.${id}.meta.title`, { defaultValue: t('details.default.meta.title') }),
    description: t(`details.${id}.meta.description`, {
      defaultValue: t('details.default.meta.description'),
    }),
  });
}

async function JobContent({ params }: PageProps) {
  const { locale, id } = await params;
  const job = JOBS.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  return (
    <div className="relative overflow-hidden bg-[#0a0805] text-[#d4cfc0]">
      <JobDetailView jobId={job.id} locale={locale} />
    </div>
  );
}

export default function JobPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0805]" />}>
      <JobContent params={params} />
    </Suspense>
  );
}
