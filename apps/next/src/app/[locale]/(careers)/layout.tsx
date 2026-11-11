import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { CareersBackground } from './careers/_components';

interface ICareersLayoutProps {
  children: React.ReactNode;
}

const CareersLayout = async ({ children }: ICareersLayoutProps) => {

  return (
    <div data-theme="careers" className="contents">
      <CareersBackground/>
      <Header theme="careers" />
      <main className="flex-1">{children}</main>
      <Footer theme="careers" />
    </div>
  );
};

export default CareersLayout;
