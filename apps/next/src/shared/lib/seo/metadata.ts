import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { getT } from '@/shared/lib/i18n/server';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.BASE_URL ||
  'https://pipelinestudios.com'
).replace(/\/+$/, '');

export const SITE_NAME = 'Pipeline Studio';

const OG_IMAGE = '/og-image.jpg';

const OG_LOCALES: Record<string, string> = {
  en: 'en_US',
  uk: 'uk_UA',
  ua: 'uk_UA',
};

type BuildMetadataParams = {
  locale: string;
  path?: string;
  title?: string;
  description?: string;
};

export function buildMetadata({
  locale,
  path = '',
  title,
  description,
}: BuildMetadataParams): Metadata {
  const ogLocale = OG_LOCALES[locale] ?? OG_LOCALES.en;
  const alternateLocale = Array.from(new Set(Object.values(OG_LOCALES))).filter(
    (value) => value !== ogLocale,
  );
  const url = `/${locale}${path}`;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `/en${path}`,
        uk: `/ua${path}`,
        'x-default': `/en${path}`,
      },
    },
    openGraph: {
      title: title ?? SITE_NAME,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} Preview`,
        },
      ],
      locale: ogLocale,
      alternateLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? SITE_NAME,
      description,
      images: [OG_IMAGE],
    },
  };
}

async function getMarketingDescription(locale: string): Promise<string> {
  'use cache';
  cacheLife('days');

  const { t } = await getT('marketing', { lng: locale });
  return t('meta.description');
}

export async function getRootMetadata(locale: string): Promise<Metadata> {
  const description = await getMarketingDescription(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      other: [
        {
          rel: 'android-chrome',
          url: '/android-chrome-192x192.png',
          sizes: '192x192',
        },
        {
          rel: 'android-chrome',
          url: '/android-chrome-512x512.png',
          sizes: '512x512',
        },
      ],
    },
    ...buildMetadata({ locale, description }),
  };
}

// 👇 Расширенный тип для гибкой передачи (готовые строки или ключи)
export type PageMetadataOverrides = {
  title?: string;
  description?: string;
  titleKey?: string;
  descriptionKey?: string;
  fallbackTitleKey?: string;
  fallbackDescriptionKey?: string;
};

export async function getPageMetadata(
  locale: string,
  namespace: string,
  path = '',
  overrides?: PageMetadataOverrides,
): Promise<Metadata> {
  'use cache';
  cacheLife('days');

  const { t } = await getT(namespace, { lng: locale });

  // Разрешаем Title
  let resolvedTitle = overrides?.title;
  if (!resolvedTitle && overrides?.titleKey) {
    resolvedTitle = t(overrides.titleKey, {
      defaultValue: overrides.fallbackTitleKey ? t(overrides.fallbackTitleKey) : t('meta.title'), // Дефолтный фоллбек, если ничего не передано
    });
  } else if (!resolvedTitle) {
    resolvedTitle = t('meta.title');
  }

  // Разрешаем Description
  let resolvedDescription = overrides?.description;
  if (!resolvedDescription && overrides?.descriptionKey) {
    resolvedDescription = t(overrides.descriptionKey, {
      defaultValue: overrides.fallbackDescriptionKey
        ? t(overrides.fallbackDescriptionKey)
        : t('meta.description'), // Дефолтный фоллбек
    });
  } else if (!resolvedDescription) {
    resolvedDescription = t('meta.description');
  }

  return buildMetadata({
    locale,
    path,
    title: resolvedTitle,
    description: resolvedDescription,
  });
}
