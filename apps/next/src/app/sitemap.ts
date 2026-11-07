import type { MetadataRoute } from 'next';

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.BASE_URL ||
  'https://pipelinestudios.com'
).replace(/\/+$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/en`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/ua`,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
