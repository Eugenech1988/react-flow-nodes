'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useT } from 'next-i18next/client';
import i18nConfig from '@/shared/lib/i18n/i18n.config';

export function LanguageSwitcher() {
  const { t } = useT('common');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const switchLanguage = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    const qs = searchParams.toString();
    router.push(segments.join('/') + (qs ? `?${qs}` : ''));
  };

  return (
    <div>
      {i18nConfig.supportedLngs.map((lng) => (
        <button key={lng} type="button" onClick={() => switchLanguage(lng)}>
          {t(`languages.${lng}`)}
        </button>
      ))}
    </div>
  );
}