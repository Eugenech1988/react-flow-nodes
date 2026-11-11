import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { CareersBackground } from './careers/_components';

interface ICareersLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const CareersLayout = async ({ children, params }: ICareersLayoutProps) => {
  const { locale } = await params;

  return (
    <div data-theme="careers" className="contents">
      <CareersBackground/>
      <Header theme="careers" locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer theme="careers" />
    </div>
  );
};

export default CareersLayout;
