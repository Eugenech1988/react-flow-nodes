'use client';

import { useRouter } from 'next/navigation';
import { useT } from '@/shared/lib/i18n/client';

interface LanguageSwitcherProps {
  locale?: string;
  isMobile?: boolean;
  theme?: 'default' | 'careers' | 'blog';
}

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ua', label: 'UA' },
] as const;

export function LanguageSwitcher({ locale, isMobile = false, theme = 'default' }: LanguageSwitcherProps) {
  const { i18n } = useT('common');
  const router = useRouter();

  const current = (locale || i18n?.language || 'en').toLowerCase().split('-')[0].split('_')[0];

  const isTechnical = theme === 'careers' || theme === 'blog';
  const roundingClass = isTechnical ? 'rounded-sm' : 'rounded-xl';
  const btnRoundingClass = isTechnical ? 'rounded-sm' : 'rounded-lg';

  const switchLanguage = (next: string) => {
    if (current === next || (next === 'ua' && current === 'uk')) return;

    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(next);
    }

    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const segments = pathname.split('/');
      const isLocaleInPath = ['en', 'ua', 'uk'].includes(segments[1]);

      if (isLocaleInPath) {
        segments[1] = next;
      } else {
        segments.splice(1, 0, next);
      }

      router.push(segments.join('/') || '/', { scroll: false });
    }
  };

  return (
    <div
      className={`relative flex items-center gap-1 border border-theme-line bg-theme-surface/80 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] backdrop-blur-sm ${roundingClass} ${
        isMobile ? 'w-full' : ''
      }`}
    >
      <span className="absolute top-1.5 left-1.5 h-1 w-1 rounded-full bg-theme-rivet shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
      <span className="absolute right-1.5 bottom-1.5 h-1 w-1 rounded-full bg-theme-rivet shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />

      {LANGS.map(({ code, label }) => {
        const isActive = current === code || (code === 'ua' && current === 'uk');
        const activeClasses = `border border-theme-accent bg-theme-accent/20 text-theme-accent font-bold ${btnRoundingClass}`;
        const inactiveClasses = `border border-transparent text-theme-muted hover:bg-theme-panel hover:text-theme-fg ${btnRoundingClass}`;

        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLanguage(code)}
            className={`relative flex h-7 items-center justify-center font-mono text-[10px] uppercase tracking-widest transition-all duration-300 sm:text-xs ${
              isMobile ? 'flex-1 px-2' : 'px-3.5 sm:px-4'
            } ${isActive ? activeClasses : inactiveClasses}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}