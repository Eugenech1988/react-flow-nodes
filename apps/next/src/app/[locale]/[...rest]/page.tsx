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

const LocaleAwareNotFound = async ({ params }: Pick<IPageProps, 'params'>) => {
  const { locale } = await params;
  return <NotFoundClient locale={locale} />;
};

const RootNotFound = ({ params }: IPageProps) => {
  return (
    <Suspense fallback={null}>
      <LocaleAwareNotFound params={params} />
    </Suspense>
  );
};

export default RootNotFound;
