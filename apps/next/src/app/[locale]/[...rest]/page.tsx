import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NotFoundClient } from '../not-found-client';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return [{ rest: ['not-found'] }];
}

async function LocaleAwareNotFound({ params }: Pick<PageProps, 'params'>) {
  const { locale } = await params;
  return <NotFoundClient locale={locale} />;
}

export default function RootNotFound({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      <LocaleAwareNotFound params={params} />
    </Suspense>
  );
}