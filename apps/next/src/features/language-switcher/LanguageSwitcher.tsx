'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import i18nConfig from '@/shared/lib/i18n/config';
import { useT } from '@/shared/lib/i18n/client';
import { cn } from '@/shared/lib';

interface LanguageSwitcherProps {
  isMobile?: boolean;
  theme?: 'default' | 'careers';
}

export function LanguageSwitcher({ isMobile = false, theme = 'default' }: LanguageSwitcherProps) {
  const { t, i18n } = useT('common');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isCareers = theme === 'careers';

  const switchLanguage = (locale: string) => {
    if (i18n.language === locale) return;

    const segments = pathname.split('/');
    segments[1] = locale;

    const query = searchParams.toString();
    const newPath = segments.join('/') + (query ? `?${query}` : '');

    router.push(newPath, { scroll: false });
  };

  const containerClasses = cn(
    'relative flex items-center gap-1 border p-1',
    isMobile && 'w-full',
    isCareers
      ? 'rounded-sm border-[#2f3d36] bg-[#0a0e0d] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]'
      : 'rounded-xl border-slate-700/60 bg-[#0a1210] shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]',
  );

  const screwClasses = cn(
    'absolute h-1 w-1 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]',
    isCareers ? 'bg-[#3a4842]' : 'bg-slate-600',
  );

  return (
    <div className={containerClasses}>
      <span className={cn(screwClasses, 'top-1.5 left-1.5')} />
      <span className={cn(screwClasses, 'right-1.5 bottom-1.5')} />

      {i18nConfig.supportedLngs.map((lng) => {
        const isActive = i18n.language === lng;
        const label = t(`languages.${lng}`, { defaultValue: lng.toUpperCase() });

        const buttonClasses = cn(
          'relative flex h-7 cursor-pointer items-center justify-center px-3 font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 sm:text-xs',
          isMobile && 'flex-1',
          isActive && [
            isCareers
              ? 'rounded-sm border border-[#4a6d5e] bg-[#0d1f1e] text-[#9cc4b0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_0_#2f3d36]'
              : 'rounded-lg border border-[#2dd4bf]/40 bg-[#2dd4bf]/15 text-[#5eead4] shadow-[inset_0_0_10px_rgba(45,212,191,0.2)]',
          ],
          !isActive && [
            isCareers
              ? 'rounded-sm border border-transparent text-[#8a9488] hover:bg-[#141a16] hover:text-[#9cc4b0]'
              : 'rounded-lg border border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300',
          ],
        );

        return (
          <button
            key={lng}
            type="button"
            onClick={() => switchLanguage(lng)}
            className={buttonClasses}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}