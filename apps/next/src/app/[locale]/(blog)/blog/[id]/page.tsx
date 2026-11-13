import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { TPageWithIdProps } from '@/shared/lib';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { getT } from '@/shared/lib/i18n/server';
import { JsonLd } from '@/shared/lib/seo/JsonLd';
import { BLOG_POSTS } from '../_components/constants';
import { BlogPostView } from './_components';

export const generateMetadata = async ({ params }: TPageWithIdProps): Promise<Metadata> => {
  const { locale, id } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === id);

  if (!post) return {};

  const { t } = await getT('blog', { lng: locale });

  return getPageMetadata(locale, 'blog', `/blog/${id}`, {
    title: t(`posts.${post.slug}.title`),
    description: t(`posts.${post.slug}.excerpt`),
  });
};

const BlogPostContent = async ({ params }: TPageWithIdProps) => {
  const { locale, id } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === id);

  if (!post) notFound();

  const { t } = await getT('blog', { lng: locale });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: t(`posts.${post.slug}.title`),
    description: t(`posts.${post.slug}.excerpt`),
    datePublished: post.date.replace(/\./g, '-'),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pipeline Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pipelinestudios.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://pipelinestudios.com/${locale}/blog/${id}`,
    },
  };

  return (
    <div className="bg-theme-bg text-theme-fg relative min-h-screen">
      <JsonLd data={jsonLd} />
      <BlogPostView post={post} locale={locale} />
    </div>
  );
};

const BlogPostPage = ({ params }: TPageWithIdProps) => (
  <BlogPostContent params={params} />
);

export default BlogPostPage;
