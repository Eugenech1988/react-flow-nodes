import type { Metadata } from 'next';
import type { TPageProps } from '@/shared/lib';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { getT } from '@/shared/lib/i18n/server';
import { JsonLd } from '@/shared/lib/seo/JsonLd';
import { sanityClient, POSTS_QUERY } from '@/shared/lib/sanity';
import { BlogHero, BlogFeatured, BlogGrid, BlogCta, IBlogPostPreview } from './_components';

export const generateMetadata = async ({ params }: TPageProps): Promise<Metadata> => {
  const { locale } = await params;
  return getPageMetadata(locale, 'blog', '/blog');
};

const BlogPage = async ({ params }: TPageProps) => {
  const { locale } = await params;
  const { t } = await getT('blog', { lng: locale });

  const posts = await sanityClient.fetch<IBlogPostPreview[]>(
    POSTS_QUERY,
    { locale },
    { next: { revalidate: 60 } },
  );

  const featured = posts.find((p) => p.featured) ?? posts[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t('hero.title'),
    description: t('hero.description'),
    url: `https://pipelinestudios.com/${locale}/blog`,
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://pipelinestudios.com/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `https://pipelinestudios.com/${locale}/blog`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbs} />
      <div className="relative z-10">
        <BlogHero t={t} total={posts.length} lastUpdate={featured?.date ?? ''} />
        {featured && (
          <div className="relative z-10 mx-auto mt-8 max-w-6xl px-4 sm:mt-12 sm:px-6">
            <BlogFeatured t={t} post={featured} locale={locale} />
          </div>
        )}
        <BlogGrid posts={posts} locale={locale} />
        <BlogCta />
      </div>
    </>
  );
};

export default BlogPage;
