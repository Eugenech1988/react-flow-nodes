import {
  HeroSection,
  FeaturesSection,
  TrustedBySection,
  HowItWorksSection,
  UseCasesSection,
  PricingSection,
} from '@/widgets';

export default async function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TrustedBySection />
      <HowItWorksSection />
      <UseCasesSection />
      <PricingSection />
    </>
  );
}
