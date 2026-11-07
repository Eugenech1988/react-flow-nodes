import type { Metadata } from 'next';
import {
  HeroSection,
  FeaturesSection,
  TrustedBySection,
  HowItWorksSection,
  UseCasesSection,
  PricingSection,
  TestimonialsSection,
} from '@/widgets/marketing-sections';
import { getPageMetadata } from '@/shared/lib/seo/metadata';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadata(locale, 'marketing');
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TrustedBySection />
      <HowItWorksSection />
      <UseCasesSection />
      <TestimonialsSection />
      <PricingSection />
    </>
  );
}
