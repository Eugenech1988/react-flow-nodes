import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header theme="steampunk" />
      <main className="flex-1">{children}</main>
      <Footer theme="steampunk" />
    </>
  );
}
