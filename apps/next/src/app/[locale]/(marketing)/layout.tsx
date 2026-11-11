import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

interface IMarketingLayoutProps {
  children: React.ReactNode;
}

const MarketingLayout = async ({ children }: IMarketingLayoutProps) => {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
};

export default MarketingLayout;
