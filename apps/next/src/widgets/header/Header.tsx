'use client';

import { useState } from 'react';
import Link from 'next/link';
import PipelineLogo from '@/assets/logo.svg';
import { cn } from '@/shared/lib';
import { AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from './model';
import { LanguageSwitcher } from '@/features';
import { APP_LOGIN_URL } from '@/shared/lib/app-url';

interface IHeaderProps {
  theme?: 'default' | 'careers' | 'blog';
}

export const Header = ({ theme = 'default' }: IHeaderProps) => {
  const { t, i18n } = useT('common');
  const lng = i18n.language || 'en';
  const [isOpen, setIsOpen] = useState(false);

  const isBlog = theme === 'blog';
  const isCareers = theme === 'careers';
  const isTechnical = isCareers || isBlog;

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2 transition-all duration-300">
      <div
        className={cn(
          'border-theme-line bg-theme-header/80 relative w-full border px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:px-8 xl:px-10',
          isTechnical ? 'rounded-sm' : 'rounded-2xl',
        )}
      >
        {isBlog && (
          <>
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--theme-accent)_1px,transparent_1px),linear-gradient(90deg,var(--theme-accent)_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.03]" />
            <div className="border-theme-accent/10 pointer-events-none absolute inset-1 rounded-sm border" />
            <span className="border-theme-accent/70 pointer-events-none absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2" />
            <span className="border-theme-accent/70 pointer-events-none absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2" />
            <span className="border-theme-accent/70 pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2" />
            <span className="border-theme-accent/70 pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2" />
            <span className="pointer-events-none absolute top-1/2 left-1/2 h-10 w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--theme-accent)_0%,transparent_70%)] opacity-[0.08] blur-md" />
          </>
        )}

        <span className="via-theme-accent/30 md:via-theme-accent/60 pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent to-transparent md:inset-x-8 md:shadow-[0_0_8px_var(--theme-accent)]" />
        <span className="via-theme-accent/25 md:via-theme-accent/50 pointer-events-none absolute inset-x-4 bottom-0 h-px bg-linear-to-r from-transparent to-transparent md:inset-x-8" />

        <div className="relative z-10 flex items-center justify-between gap-2">
          <Link
            href={`/${lng}`}
            className="group flex min-w-0 flex-1 items-center gap-2.5 xl:flex-none xl:gap-3"
          >
            <div className="text-theme-accent relative flex h-6 w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 md:w-11">
              {isBlog && (
                <>
                  <span className="border-theme-accent/40 absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-[spin_12s_linear_infinite] rounded-full border border-dashed motion-reduce:animate-none" />
                  <span className="border-theme-accent/10 absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border" />
                </>
              )}
              <PipelineLogo className="relative z-10 h-full w-full stroke-current drop-shadow-[0_0_8px_var(--theme-accent)]" />
            </div>
            <span className="to-theme-accent truncate bg-linear-to-r from-white via-white bg-clip-text text-sm font-medium tracking-widest whitespace-nowrap text-transparent uppercase sm:text-base xl:text-lg xl:tracking-[0.15em]">
              pipeline studio
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label={t('header.nav.label')}>
            {NAV_LINKS.map((link) => (
              <AppButton
                key={link.id}
                isLink
                linkTo={`/${lng}${link.href}`}
                variant="nav"
                className={cn(
                  'text-theme-muted hover:bg-theme-panel hover:text-theme-fg hover:after:bg-theme-accent hover:after:shadow-[0_0_8px_var(--theme-accent)]',
                  isTechnical ? 'rounded-sm' : 'rounded-xl',
                )}
              >
                {t(`header.nav.${link.id}`)}
              </AppButton>
            ))}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <LanguageSwitcher locale={lng} theme={theme} />

            <div className="bg-theme-line h-6 w-px" />

            <AppButton
              isLink
              linkTo={APP_LOGIN_URL}
              variant="nav"
              className={cn(
                'text-theme-muted hover:text-theme-fg text-sm font-medium',
                isTechnical ? 'rounded-sm' : 'rounded-xl',
              )}
            >
              {t('header.signIn')}
            </AppButton>

            <AppButton
              isLink
              variant={isCareers ? 'careers' : 'primary'}
              className={cn({
                'rounded-sm capitalize': isTechnical,
                'rounded-xl': !isTechnical,
              })}
              newTab={false}
              linkTo={APP_LOGIN_URL}
              size="sm"
            >
              {t('header.getStarted')}
            </AppButton>
          </div>

          <AppButton
            variant="ghost"
            size="xs"
            icon={isOpen ? X : Menu}
            iconClassName="h-5 w-5"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'border-theme-line text-theme-fg hover:bg-theme-panel mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border p-0 xl:hidden',
              isTechnical ? 'rounded-sm' : 'rounded-lg',
            )}
            aria-label={t('header.toggleMenu')}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          />
        </div>

        <div
          id="mobile-menu"
          className={cn(
            'border-theme-line bg-theme-header/95 grid border backdrop-blur-lg transition-all duration-300 ease-in-out xl:hidden',
            isOpen
              ? 'pointer-events-auto visible my-2 grid-rows-[1fr] opacity-100'
              : 'pointer-events-none invisible mt-0 grid-rows-[0fr] opacity-0',
            isTechnical ? 'rounded-sm' : 'rounded-2xl',
          )}
        >
          <div className="overflow-hidden">
            <div className="relative flex flex-col gap-1 p-4 sm:p-5">
              {NAV_LINKS.map((link) => (
                <AppButton
                  key={link.id}
                  isLink
                  linkTo={`/${lng}${link.href}`}
                  onClick={() => setIsOpen(false)}
                  variant="nav"
                  className={cn(
                    'text-theme-muted hover:bg-theme-panel hover:text-theme-fg h-auto w-full justify-start px-3 py-2.5 text-base',
                    isTechnical ? 'rounded-sm' : 'rounded-xl',
                  )}
                >
                  {t(`header.nav.${link.id}`)}
                </AppButton>
              ))}

              <div className="my-2 flex items-center gap-2 px-3">
                <span className="bg-theme-accent/60 h-1 w-1 rounded-full" />
                <span className="from-theme-accent/40 via-theme-line h-px flex-1 bg-linear-to-r to-transparent" />
                <span className="bg-theme-accent/60 h-1 w-1 rounded-full" />
              </div>

              <div className="flex flex-col gap-3 pt-1 pb-1">
                <LanguageSwitcher locale={lng} theme={theme} isMobile />

                <AppButton
                  isLink
                  linkTo={APP_LOGIN_URL}
                  onClick={() => setIsOpen(false)}
                  variant="nav"
                  className={cn(
                    'text-theme-muted hover:text-theme-fg h-auto w-full text-center text-sm font-medium',
                    isTechnical ? 'rounded-sm' : 'rounded-xl',
                  )}
                >
                  {t('header.signIn')}
                </AppButton>

                <AppButton
                  isLink
                  linkTo={APP_LOGIN_URL}
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  variant={isCareers ? 'careers' : 'primary'}
                  className={cn({
                    'rounded-sm capitalize': isTechnical,
                    'rounded-xl': !isTechnical,
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
