import type { MetadataRoute } from 'next';
import i18nConfig from '@/shared/lib/i18n/config';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL || 'https://pipelinestudios.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [''];

  return paths.flatMap((path) =>
    i18nConfig.supportedLngs.map((lng) => ({
      url: `${SITE_URL}/${lng}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          i18nConfig.supportedLngs.map((l) => [l, `${SITE_URL}/${l}${path}`]),
        ),
      },
    })),
  );
}