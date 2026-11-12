import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { TPageWithIdProps } from '@/shared/lib';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { getT } from '@/shared/lib/i18n/server';
import { getJobBySlug } from '@/shared/api';
import { JobDetailView } from './_components';
import { JsonLd } from '@/shared/lib/seo/JsonLd';

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: new Date().toISOString().split('T')[0],
    employmentType: job.type,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Pipeline Studio',
      sameAs: 'https://pipelinestudios.com',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'Remote',
      },
    },
  };

  return (
    <div className="bg-theme-bg text-theme-fg relative">
      <JsonLd data={jsonLd} />
      <JobDetailView job={job} locale={locale} />
    </div>
  );
};

const JobPage = ({ params }: TPageWithIdProps) => (
  <Suspense fallback={<div className="bg-theme-bg min-h-screen" />}>
    <JobContent params={params} />
  </Suspense>
);

export default JobPage;
