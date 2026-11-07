import type { Metadata } from 'next';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { AboutBackground, AboutHero, AboutInteractiveContent } from './_components';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadata(locale, 'about', '/about');
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040a09] text-[#d1faf5]">
      <AboutBackground />
      <AboutHero />
      <AboutInteractiveContent />
    </div>
  );
}
