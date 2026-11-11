import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { BlogBackground } from './blog/_components';

interface IBlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout = async ({ children }: IBlogLayoutProps) => {

  return (
    <div data-theme="blog" className="contents">
      <BlogBackground />
      <Header theme="blog" />
      <main className="flex-1">{children}</main>
      <Footer theme="blog" />
    </div>
  );
};

export default BlogLayout;