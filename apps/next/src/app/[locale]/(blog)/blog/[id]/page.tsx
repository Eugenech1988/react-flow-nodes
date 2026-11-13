import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { TPageWithIdProps } from '@/shared/lib';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { JsonLd } from '@/shared/lib/seo/JsonLd';
import { sanityClient, POST_BY_SLUG_QUERY, ALL_SLUGS_QUERY } from '@/shared/lib/sanity';
import { BlogPostView, IBlogPostDetail } from './_components';
import { Suspense } from 'react';

export const generateStaticParams = async () => {
  const locales = ['en', 'uk'];
  const result: { locale: string; id: string }[] = [];

  for (const locale of locales) {
    const slugs = await sanityClient.fetch<{ slug: string }[]>(
      ALL_SLUGS_QUERY,
      {locale},
      {next: {revalidate: 3600}}
    );
    for (const s of slugs) result.push({locale, id: s.slug});
  }

  return result;
};

export const generateMetadata = async ({params}: TPageWithIdProps): Promise<Metadata> => {
  const {locale, id} = await params;
  const post = await sanityClient.fetch<IBlogPostDetail | null>(
    POST_BY_SLUG_QUERY,
    {locale, slug: id},
    {next: {revalidate: 60}}
  );

  if (!post) return {};

  return getPageMetadata(locale, 'blog', `/blog/${id}`, {
    title: post.title,
    description: post.excerpt
  });
};

const BlogPostContent = async ({params}: TPageWithIdProps) => {
  const {locale, id} = await params;
  const post = await sanityClient.fetch<IBlogPostDetail | null>(
    POST_BY_SLUG_QUERY,
    {locale, slug: id},
    {next: {revalidate: 60}}
  );

  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date ? post.date.replace(/\./g, '-') : undefined,
    author: {'@type': 'Person', name: post.author},
    publisher: {
      '@type': 'Organization',
      name: 'Pipeline Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pipelinestudios.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://pipelinestudios.com/${locale}/blog/${id}`
    }
  };

  return (
    <div className="bg-theme-bg text-theme-fg relative min-h-screen">
      <JsonLd data={jsonLd}/>
      <BlogPostView post={post} locale={locale}/>
    </div>
  );
};

const BlogPostPage = ({params}: TPageWithIdProps) => (
  <Suspense fallback={null}>
    <BlogPostContent params={params}/>
  </Suspense>
);


export default BlogPostPage;
