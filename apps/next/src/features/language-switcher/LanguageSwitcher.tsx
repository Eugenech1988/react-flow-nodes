'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import i18nConfig from '@/shared/lib/i18n/config';
import { useT } from '@/shared/lib/i18n/client';

export function LanguageSwitcher({ isMobile = false }: { isMobile?: boolean }) {
  const { t, i18n } = useT('common');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const switchLanguage = (locale: string) => {
    if (i18n.language === locale) return;

    const segments = pathname.split('/');
    segments[1] = locale;

    const query = searchParams.toString();
    router.push(segments.join('/') + (query ? `?${query}` : ''));
  };

  return (
    <div
      className={`relative flex items-center gap-1 rounded-xl border border-slate-700/60 bg-[#0a1210] p-1 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] ${
        isMobile ? 'w-full justify-center' : ''
      }`}
    >
      <span className="absolute top-1.5 left-1.5 h-1 w-1 rounded-full bg-slate-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
      <span className="absolute right-1.5 bottom-1.5 h-1 w-1 rounded-full bg-slate-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />

      {i18nConfig.supportedLngs.map((lng) => {
        const isActive = i18n.language === lng;
        const label = t(`languages.${lng}`, { defaultValue: lng.toUpperCase() });

        return (
          <button
            key={lng}
            type="button"
            onClick={() => switchLanguage(lng)}
            className={`relative flex h-7 items-center justify-center rounded-lg px-3 font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 sm:text-xs ${
              isActive
                ? 'border border-[#2dd4bf]/40 bg-[#2dd4bf]/15 text-[#5eead4] shadow-[inset_0_0_10px_rgba(45,212,191,0.2)]'
                : 'border border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
