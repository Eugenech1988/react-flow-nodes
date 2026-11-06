import {
  HeroSection,
  FeaturesSection,
  TrustedBySection,
  HowItWorksSection,
  UseCasesSection,
  PricingSection,
  TestimonialsSection,
} from '@/widgets';

export default async function Home() {
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
