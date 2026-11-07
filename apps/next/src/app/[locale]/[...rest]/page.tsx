import type { Metadata } from 'next';
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

export default async function RootNotFound({ params }: PageProps) {
  const { locale } = await params;

  return <NotFoundClient locale={locale} />;
}
