'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import PipelineLogo from '@/assets/logo.svg';
import { cn } from '@/shared/lib';
import { AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from './model';
import { LanguageSwitcher } from '@/features';

interface THeaderProps {
  theme?: 'default' | 'careers';
}

export const Header = ({ theme = 'default' }: THeaderProps) => {
  const { t, i18n } = useT('common');
  const lng = i18n.language;
  const [isOpen, setIsOpen] = useState(false);

  const isCareers = theme === 'careers';

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2 transition-all duration-300">
      <div
        className={cn(
          'relative w-full border border-theme-line bg-theme-header/80 px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:px-8 xl:px-10',
          isCareers ? 'rounded-sm' : 'rounded-3xl',
        )}
      >
        <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-theme-accent/30 to-transparent md:inset-x-8 md:via-theme-accent/60 md:shadow-[0_0_8px_var(--theme-accent)]" />
        <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-linear-to-r from-transparent via-theme-accent/25 to-transparent md:inset-x-8 md:via-theme-accent/50" />

        <div className="relative z-10 flex items-center justify-between gap-2">
          <Link
            href={`/${lng}`}
            className="group flex min-w-0 flex-1 items-center gap-2.5 xl:flex-none xl:gap-3"
          >
            <div className="flex h-6 w-9 shrink-0 items-center justify-center text-theme-accent transition-transform duration-300 group-hover:scale-110 md:w-11">
              <PipelineLogo className="h-full w-full stroke-current drop-shadow-[0_0_8px_var(--theme-accent)]" />
            </div>
            <span className="truncate bg-linear-to-r from-white via-white to-theme-accent bg-clip-text text-sm font-medium tracking-widest uppercase whitespace-nowrap text-transparent sm:text-base xl:text-lg xl:tracking-[0.15em]">
              pipeline studio
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((link) => (
              <AppButton
                key={link.id}
                isLink
                linkTo={`/${lng}${link.href}`}
                variant="nav"
                className={cn(
                  'text-theme-muted hover:bg-theme-panel hover:text-theme-fg hover:after:bg-theme-accent hover:after:shadow-[0_0_8px_var(--theme-accent)]',
                  isCareers ? 'rounded-sm' : 'rounded-xl'
                )}
              >
                {t(`header.nav.${link.id}`)}
              </AppButton>
            ))}
          </nav>

          {/* Правая часть (Desktop) */}
          <div className="hidden items-center gap-4 xl:flex">
            <Suspense
              fallback={
                <div
                  className={cn('h-9.5 w-22.5 animate-pulse bg-theme-panel', {
                    'rounded-sm': isCareers,
                    'rounded-xl': !isCareers,
                  })}
                />
              }
            >
              <LanguageSwitcher theme={theme as any} />
            </Suspense>

            {/* Разделитель */}
            <div className="h-6 w-px bg-theme-line" />

            {/* Кнопка Sing In */}
            <AppButton
              isLink
              linkTo="http://localhost:5173/login"
              variant="nav"
              className={cn(
                'text-sm font-medium text-theme-muted hover:text-theme-fg',
                isCareers ? 'rounded-sm' : 'rounded-xl'
              )}
            >
              {t('header.signIn')}
            </AppButton>

            {/* Кнопка Get Started */}
            <AppButton
              isLink
              variant="primary"
              className={cn({
                'rounded-sm capitalize': isCareers,
                'rounded-xl': !isCareers,
              })}
              newTab={false}
              linkTo="http://localhost:5173/login"
              size="sm"
            >
              {t('header.getStarted')}
            </AppButton>
          </div>

          {/* Кнопка мобильного меню (Бургер) */}
          <AppButton
            variant="ghost"
            size="xs"
            icon={isOpen ? X : Menu}
            iconClassName="h-5 w-5"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-theme-line p-0 text-theme-fg hover:bg-theme-panel xl:hidden',
              isCareers ? 'rounded-sm' : 'rounded-xl'
            )}
            aria-label={t('header.toggleMenu')}
          />
        </div>

        {/* Мобильное меню */}
        <div
          className={cn(
            'grid border border-theme-line bg-theme-header/95 backdrop-blur-lg transition-all duration-300 ease-in-out xl:hidden',
            isOpen
              ? 'pointer-events-auto visible my-2 grid-rows-[1fr] opacity-100'
              : 'pointer-events-none invisible mt-0 grid-rows-[0fr] opacity-0',
            isCareers ? 'rounded-sm' : 'rounded-2xl'
          )}
        >
          <div className="overflow-hidden">
            <div className="relative flex flex-col gap-1 p-4 sm:p-5">

              {/* Ссылки навигации */}
              {NAV_LINKS.map((link) => (
                <AppButton
                  key={link.id}
                  isLink
                  linkTo={`/${lng}${link.href}`}
                  onClick={() => setIsOpen(false)}
                  variant="nav"
                  className={cn(
                    'h-auto w-full justify-start px-3 py-2.5 text-base text-theme-muted hover:bg-theme-panel hover:text-theme-fg',
                    isCareers ? 'rounded-sm' : 'rounded-xl'
                  )}
                >
                  {t(`header.nav.${link.id}`)}
                </AppButton>
              ))}

              {/* Декоративный разделитель */}
              <div className="my-2 flex items-center gap-2 px-3">
                <span className="h-1 w-1 rounded-full bg-theme-accent/60" />
                <span className="h-px flex-1 bg-linear-to-r from-theme-accent/40 via-theme-line to-transparent" />
                <span className="h-1 w-1 rounded-full bg-theme-accent/60" />
              </div>

              {/* Кнопки и переключатель в мобильном меню */}
              <div className="flex flex-col gap-3 pt-1 pb-1">
                <Suspense
                  fallback={
                    <div
                      className={cn('h-9.5 w-full animate-pulse bg-theme-panel', {
                        'rounded-sm': isCareers,
                        'rounded-xl': !isCareers,
                      })}
                    />
                  }
                >
                  <LanguageSwitcher theme={theme as any} isMobile />
                </Suspense>

                <AppButton
                  isLink
                  linkTo="http://localhost:5173/login"
                  onClick={() => setIsOpen(false)}
                  variant="nav"
                  className={cn(
                    'h-auto w-full text-center text-sm font-medium text-theme-muted hover:text-theme-fg',
                    isCareers ? 'rounded-sm' : 'rounded-xl'
                  )}
                >
                  {t('header.signIn')}
                </AppButton>

                <AppButton
                  isLink
                  linkTo="http://localhost:5173/login"
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  variant="primary"
                  className={cn({
                    'rounded-sm capitalize': isCareers,
                    'rounded-xl': !isCareers,
                  })}
                >
                  {t('header.getStarted')}
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};