import type { Metadata } from 'next';
import type { TPageProps } from '@/shared/lib';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { AboutBackground, AboutHero, AboutInteractiveContent } from './_components';

export const generateMetadata = async ({ params }: TPageProps): Promise<Metadata> => {
  const { locale } = await params;
  return getPageMetadata(locale, 'about', '/about');
};

const AboutPage = () => (
  <div className="bg-theme-bg text-theme-fg relative min-h-screen overflow-hidden">
    <AboutBackground />
    <AboutHero />
    <AboutInteractiveContent />
  </div>
);

export default AboutPage;
