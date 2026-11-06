import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Roboto, Roboto_Mono } from 'next/font/google';
import { I18nProvider } from '@/providers';
import i18nConfig from '@/shared/lib/i18n/config';
import { generateI18nStaticParams, getT } from '@/shared/lib/i18n/server';
import '../globals.css';

const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  variable: '--font-roboto',
  subsets: ['latin', 'cyrillic'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin', 'cyrillic'],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL || 'https://pipelinestudios.com';

const SITE_NAME = 'Pipeline Studio';

const OG_LOCALES: Record<string, string> = {
  en: 'en_US',
  uk: 'uk_UA',
};

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return generateI18nStaticParams<'locale'>();
}

export async function generateMetadata({ params }: Pick<LayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;

  if (!i18nConfig.supportedLngs.includes(locale)) notFound();

  const { t } = await getT('marketing', { lng: locale });
  const description = t('meta.description');

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        uk: '/ua',
        'x-default': '/en',
      },
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
    openGraph: {
      title: SITE_NAME,
      description,
      url: `/${locale}`,
      siteName: SITE_NAME,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} Preview`,
        },
      ],
      locale: OG_LOCALES[locale] ?? OG_LOCALES.en,
      alternateLocale: Object.entries(OG_LOCALES)
        .filter(([l]) => l !== locale)
        .map(([, value]) => value),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description,
      images: ['/og-image.jpg'],
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!i18nConfig.supportedLngs.includes(locale)) notFound();

  return (
    <html lang={locale} className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <I18nProvider lng={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
