'use client';

import { useRouter } from 'next/navigation';
import i18nConfig from '@/shared/lib/i18n/config';
import { useT } from '@/shared/lib/i18n/client';
import { cn } from '@/shared/lib';

interface ILanguageSwitcherProps {
  locale: string;
  isMobile?: boolean;
  theme?: 'default' | 'careers' | 'blog';
}

export const LanguageSwitcher = ({
                                   locale,
                                   isMobile = false,
                                   theme = 'default',
                                 }: ILanguageSwitcherProps) => {
  const { t } = useT('common');
  const router = useRouter();

  const currentLocale =
    locale && i18nConfig.supportedLngs.includes(locale)
      ? locale
      : (i18nConfig.fallbackLng ?? i18nConfig.supportedLngs[0]);

  const switchLanguage = (nextLocale: string) => {
    if (currentLocale === nextLocale) return;

    const segments = window.location.pathname.split('/');
    segments[1] = nextLocale;
    const newPath = `${segments.join('/')}${window.location.search}`;

    router.push(newPath, { scroll: false });
  };

  const containerClasses = cn(
    'relative flex items-stretch gap-1 border p-1',
    isMobile ? 'h-11 w-full' : 'h-11',
    theme === 'careers' &&
    'rounded-sm border-careers-border bg-careers-surface shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]',
    theme === 'blog' &&
    'rounded-sm border-blog-border bg-blog-surface shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]',
    theme === 'default' &&
    'rounded-xl border-slate-700/60 bg-[#0a1210] shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]',
  );

  const screwClasses = cn(
    'absolute h-1 w-1 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)] z-10',
    theme === 'careers' && 'bg-careers-border',
    theme === 'blog' && 'bg-blog-border',
    theme === 'default' && 'bg-slate-600',
  );

  return (
    <div className={containerClasses}>
      <span className={cn(screwClasses, 'top-1.5 left-1.5')} />
      <span className={cn(screwClasses, 'right-1.5 bottom-1.5')} />

      {i18nConfig.supportedLngs.map((lng) => {
        const isActive = currentLocale === lng;
        const label = t(`languages.${lng}`, { defaultValue: lng.toUpperCase() });

        const buttonClasses = cn(
          'relative flex cursor-pointer items-center justify-center px-3 font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 sm:text-xs',
          isMobile && 'flex-1',
          isActive && theme === 'careers' && [
            'rounded-sm border border-[#4a6d5e] bg-careers-panel text-careers-accent shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_0_#2f3d36]',
          ],
          isActive && theme === 'blog' && [
            'rounded-sm border border-blog-accent/60 bg-blog-accent/15 text-blog-accent-hover shadow-[inset_0_0_10px_rgba(45,212,191,0.2)]',
          ],
          isActive && theme === 'default' && [
            'rounded-lg border border-[#2dd4bf]/40 bg-[#2dd4bf]/15 text-[#5eead4] shadow-[inset_0_0_10px_rgba(45,212,191,0.2)]',
          ],
          !isActive && theme === 'careers' && [
            'rounded-sm border border-transparent text-careers-muted hover:bg-[#141a16] hover:text-careers-accent',
          ],
          !isActive && theme === 'blog' && [
            'rounded-sm border border-transparent text-blog-dim hover:bg-blog-panel hover:text-blog-accent',
          ],
          !isActive && theme === 'default' && [
            'rounded-lg border border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300',
          ],
        );

        return (
          <button
            key={lng}
            type="button"
            onClick={() => switchLanguage(lng)}
            className={buttonClasses}
            aria-pressed={isActive}
          >
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};