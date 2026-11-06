import {
  HeroSection,
  FeaturesSection,
  TrustedBySection,
  HowItWorksSection,
  UseCasesSection,
} from '@/widgets';

type PageProps = { params: Promise<{ locale: string }> };

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <HeroSection lng={locale} />
      <FeaturesSection />
      <TrustedBySection />
      <HowItWorksSection />
      <UseCasesSection />
    </>
  );
}