import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { getT } from '@/shared/lib/i18n/server';
import { getJobBySlug } from '@/shared/api';
import { JobDetailView } from './_components';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const job = await getJobBySlug(locale, id);

  if (!job) return {};

  const { t } = await getT('careers', { lng: locale });

  return getPageMetadata(locale, 'careers', `/careers/${id}`, {
    title: job.metaTitle || job.title || t('details.default.meta.title'),
    description: job.metaDescription || job.description || t('details.default.meta.description'),
  });
}

async function JobContent({ params }: PageProps) {
  const { locale, id } = await params;
  const job = await getJobBySlug(locale, id);

  if (!job) {
    notFound();
  }

  return (
    <div className="relative overflow-hidden bg-[#0a0805] text-[#d4cfc0]">
      <JobDetailView job={job} locale={locale} />
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