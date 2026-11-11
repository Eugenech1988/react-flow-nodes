import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { TPageWithIdProps } from '@/shared/lib';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { getT } from '@/shared/lib/i18n/server';
import { getJobBySlug } from '@/shared/api';
import { JobDetailView } from './_components';

export const generateMetadata = async ({ params }: TPageWithIdProps): Promise<Metadata> => {
  const { locale, id } = await params;
  const job = await getJobBySlug(locale, id);

  if (!job) return {};

  const { t } = await getT('careers', { lng: locale });

  return getPageMetadata(locale, 'careers', `/careers/${id}`, {
    title: job.metaTitle || job.title || t('details.default.meta.title'),
    description: job.metaDescription || job.description || t('details.default.meta.description'),
  });
};

const JobContent = async ({ params }: TPageWithIdProps) => {
  const { locale, id } = await params;
  const job = await getJobBySlug(locale, id);

  if (!job) notFound();

  return (
    <div className="relative bg-[#0a0805] text-[#d4cfc0]">
      <JobDetailView job={job} locale={locale} />
    </div>
  );
};

const JobPage = ({ params }: TPageWithIdProps) => (
  <Suspense fallback={<div className="min-h-screen bg-[#0a0805]" />}>
    <JobContent params={params} />
  </Suspense>
);

export default JobPage;
