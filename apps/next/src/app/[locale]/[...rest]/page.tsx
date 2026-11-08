import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NotFoundClient } from '../not-found-client';

interface IPageProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
};

export const generateStaticParams = () => {
  return [{ rest: ['not-found'] }];
};

const LocaleAwareNotFound = async ({ params }: Pick<IPageProps, 'params'>) => {
  const { locale } = await params;
  return <NotFoundClient locale={locale} />;
};

export default function RootNotFound({ params }: IPageProps) {
  return (
    <Suspense fallback={null}>
      <LocaleAwareNotFound params={params} />
    </Suspense>
  );
}
