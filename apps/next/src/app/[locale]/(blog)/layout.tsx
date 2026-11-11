import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { BlogBackground } from './blog/_components';

interface IBlogLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const BlogLayout = async ({ children, params }: IBlogLayoutProps) => {
  const { locale } = await params;

  return (
    <>
      <BlogBackground />
      <Header locale={locale} theme="blog" />
      <main className="flex-1">{children}</main>
      <Footer theme="blog" />
    </>
  );
};

export default BlogLayout;