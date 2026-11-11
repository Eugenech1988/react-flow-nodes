import type { Metadata } from 'next';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { AboutBackground, AboutHero, AboutInteractiveContent } from './_components';

type TPageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({ params }: TPageProps): Promise<Metadata> => {
  const { locale } = await params;

  return getPageMetadata(locale, 'about', '/about');
};

const AboutPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040a09] text-[#d1faf5]">
      <AboutBackground />
      <AboutHero />
      <AboutInteractiveContent />
    </div>
  );
};

export default AboutPage;
