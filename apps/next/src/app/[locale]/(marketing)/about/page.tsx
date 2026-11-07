import type { Metadata } from 'next';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { AboutClient } from './about-client';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadata(locale, 'about', '/about');
}

export default function AboutPage() {
  return <AboutClient />;
}
