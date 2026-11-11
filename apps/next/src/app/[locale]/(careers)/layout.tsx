import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

interface IMarketingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const CareersLayout = async ({ children, params }: IMarketingLayoutProps) => {
  const { locale } = await params;

  return (
    <>
      <Header theme="careers" locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer theme="careers" />
    </>
  );
};

export default CareersLayout;
