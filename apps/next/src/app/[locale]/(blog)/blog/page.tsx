import type { Metadata } from 'next';
import type { TPageProps } from '@/shared/lib';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { getT } from '@/shared/lib/i18n/server';
import { BlogHero, BlogFeatured, BlogGrid, BlogCta, BLOG_POSTS } from './_components';

export const generateMetadata = async ({params}: TPageProps): Promise<Metadata> => {
  const {locale} = await params;
  return getPageMetadata(locale, 'blog', '/blog');
};

const BlogPage = async ({params}: TPageProps) => {
  const {locale} = await params;
  const {t} = await getT('blog', {lng: locale});
  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: t('hero.title'),
    description: t('hero.description'),
    url: `https://pipelinestudios.com/${locale}/blog`
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://pipelinestudios.com/${locale}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `https://pipelinestudios.com/${locale}/blog`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbs)}}
      />
      <div className="relative z-10">
        <BlogHero t={t} total={BLOG_POSTS.length} lastUpdate={featured?.date ?? ''}/>
        {featured && (
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
            <BlogFeatured
              t={t}
              locale={locale}
              slug={featured.slug}
              category={featured.category}
              date={featured.date}
              readTime={featured.readTime}
              author={featured.author}
            />
          </div>
        )}
        <BlogGrid locale={locale}/>
        <BlogCta/>
      </div>
    </>
  );
};

export default BlogPage;
