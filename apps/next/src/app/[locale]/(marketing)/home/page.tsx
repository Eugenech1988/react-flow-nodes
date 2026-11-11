import type { Metadata } from 'next';
import type { TPageProps } from '@/shared/lib';
import {
  HeroSection,
  FeaturesSection,
  TrustedBySection,
  HowItWorksSection,
  UseCasesSection,
  PricingSection,
  TestimonialsSection,
} from './_components';
import { getPageMetadata } from '@/shared/lib/seo/metadata';

export const generateMetadata = async ({ params }: TPageProps): Promise<Metadata> => {
  const { locale } = await params;
  return getPageMetadata(locale, 'marketing');
};

const Home = () => (
  <div data-home-page>
    <HeroSection />
    <FeaturesSection />
    <TrustedBySection />
    <HowItWorksSection />
    <UseCasesSection />
    <TestimonialsSection />
    <PricingSection />
  </div>
);

export default Home;
