import type { MetadataRoute } from 'next';

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.BASE_URL ||
  'https://pipelinestudios.com'
).replace(/\/+$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
