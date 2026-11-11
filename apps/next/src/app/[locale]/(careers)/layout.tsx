import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { SteampunkBackground } from '@/shared/ui';

interface IMarketingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const CareersLayout = async ({ children, params }: IMarketingLayoutProps) => {
  const { locale } = await params;

  return (
    <>
      <SteampunkBackground/>
      <Header theme="careers" locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer theme="careers" />
    </>
  );
};

export default CareersLayout;
