import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Roboto, Roboto_Mono, Caveat, Special_Elite } from 'next/font/google';
import { I18nProvider } from '@/providers';
import i18nConfig from '@/shared/lib/i18n/config';
import { generateI18nStaticParams } from '@/shared/lib/i18n/server';
import { getRootMetadata } from '@/shared/lib/seo/metadata';
import '../globals.css';

const roboto = Roboto({
  weight: ['400', '700'],
  variable: '--font-roboto',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const caveat = Caveat({
  weight: ['400', '700'],
  variable: '--font-caveat',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const specialElite = Special_Elite({
  weight: '400',
  variable: '--font-typewriter',
  subsets: ['latin'],
  display: 'swap',
});

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

  return getRootMetadata(locale);
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!i18nConfig.supportedLngs.includes(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${roboto.variable} ${caveat.variable} ${specialElite.variable} ${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <I18nProvider lng={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
