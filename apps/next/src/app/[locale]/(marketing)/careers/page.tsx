import type { Metadata } from 'next';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import {
  CareersBackground,
  CareersHero,
  CareersStats,
  CareersConsole,
  CareersPerks,
  CareersProcess,
  CareersCTA,
} from './_components';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, 'careers', '/careers');
}

export default function CareersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0e0d] text-[#d4cfc0]">
      <CareersBackground />
      <CareersHero />
      <CareersStats />
      <CareersConsole />
      <CareersPerks />
      <CareersProcess />
      <CareersCTA />
    </div>
  );
}
