import type { ReactNode } from 'react';
import { I18nProvider as BaseI18nProvider } from 'next-i18next/client';
import i18nConfig from '@/shared/lib/i18n/config';
import { getResources, getT } from '@/shared/lib/i18n/server';

export const I18nProvider = async ({ lng, children }: { lng: string; children: ReactNode }) => {
  const { i18n } = await getT(undefined, { lng });

  const resources = getResources(i18n, undefined, [lng, i18nConfig.fallbackLng as string]);

  return (
    <BaseI18nProvider language={lng} resources={resources}>
      {children}
    </BaseI18nProvider>
  );
}
