'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import i18nConfig from '@/shared/lib/i18n/config';
import { useT } from '@/shared/lib/i18n/client';

interface LanguageSwitcherProps {
  isMobile?: boolean;
  theme?: 'default' | 'careers' | 'blog';
}

export function LanguageSwitcher({ isMobile = false, theme = 'default' }: LanguageSwitcherProps) {
  const { t, i18n } = useT('common');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isTechnical = theme === 'careers' || theme === 'blog';

  // Контейнер менее скруглен (xl), кнопки внутри (lg)
  const roundingClass = isTechnical ? 'rounded-sm' : 'rounded-xl';
  const btnRoundingClass = isTechnical ? 'rounded-sm' : 'rounded-lg';

  const switchLanguage = (locale: string) => {
    if (i18n.language === locale) return;

    const segments = pathname.split('/');
    segments[1] = locale;

    const query = searchParams.toString();
    const newPath = segments.join('/') + (query ? `?${query}` : '');

    router.push(newPath, { scroll: false });
  };

  return (
    <div
      className={`relative flex items-center gap-1 border border-theme-line bg-theme-surface/80 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] backdrop-blur-sm ${roundingClass} ${
        isMobile ? 'w-full justify-center' : ''
      }`}
    >
      <span className="absolute top-1.5 left-1.5 h-1 w-1 rounded-full bg-theme-rivet shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
      <span className="absolute right-1.5 bottom-1.5 h-1 w-1 rounded-full bg-theme-rivet shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />

      {i18nConfig.supportedLngs.map((lng) => {
        const isActive = i18n.language === lng;
        const label = t(`languages.${lng}`, { defaultValue: lng.toUpperCase() });

        const activeClasses = `border border-theme-accent bg-theme-accent/15 text-theme-accent-hover shadow-[inset_0_0_12px_var(--theme-accent)] font-bold ${btnRoundingClass}`;
        const inactiveClasses = `border border-transparent text-theme-muted hover:bg-theme-panel hover:text-theme-fg ${btnRoundingClass}`;

        return (
          <button
            key={lng}
            type="button"
            onClick={() => switchLanguage(lng)}
            className={`relative flex h-7 items-center justify-center px-3 font-mono text-[10px] uppercase transition-all duration-300 sm:px-3.5 sm:text-xs tracking-widest ${
              isActive ? activeClasses : inactiveClasses
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}