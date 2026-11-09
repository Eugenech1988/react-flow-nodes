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

  const btnVariant = isCareers ? 'careers' : 'primary';

  const navBtnClasses = cn({
    'rounded-sm hover:after:bg-[#6fa28c] hover:after:shadow-[0_0_8px_rgba(111,162,140,0.8)] hover:text-[#e8dcc8]':
      isCareers,
  });

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2 transition-all duration-300">
      <div
        className={cn(
          'relative w-full rounded-2xl border border-white/10 bg-white/6 px-5 py-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:bg-linear-to-b after:from-white/5 after:to-transparent after:opacity-50 sm:px-8 xl:px-10',
          {
            'rounded-sm border-[#4a5c52]/50 bg-[#0a0e0d]/80 after:rounded-sm after:from-[#4a5c52]/20':
              isCareers,
          },
        )}
      >
        <span
          className={cn(
            'pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-teal-300/30 to-transparent md:inset-x-5',
            { 'via-[#6fa28c]/50': isCareers },
          )}
        />
        <span
          className={cn(
            'pointer-events-none absolute inset-x-3 bottom-0 h-px bg-linear-to-r from-transparent via-teal-400/20 to-transparent md:inset-x-5',
            { 'via-[#6fa28c]/30': isCareers },
          )}
        />

        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/${lng}`}
            className="group flex min-w-0 flex-1 items-center gap-2.5 text-lg font-semibold tracking-tight text-white xl:flex-none xl:gap-3"
          >
            <div
              className={cn(
                'flex h-6 w-9 shrink-0 items-center justify-center text-teal-400 transition-transform duration-300 group-hover:scale-110 md:w-11',
                { 'text-[#6fa28c]': isCareers },
              )}
            >
              <PipelineLogo
                className={cn(
                  'h-full w-full stroke-current drop-shadow-[0_0_8px_rgba(57,179,155,0.4)]',
                  {
                    'drop-shadow-[0_0_8px_rgba(111,162,140,0.6)]': isCareers,
                  },
                )}
              />
            </div>
            <span
              className={cn(
                'truncate bg-linear-to-r from-white via-neutral-100 to-[#39b39b] bg-clip-text text-sm font-medium tracking-widest whitespace-nowrap text-transparent uppercase transition-colors duration-300 sm:text-base xl:text-lg xl:tracking-[0.15em]',
                { 'to-[#9cc4b0]': isCareers },
              )}
            >
              pipeline studio
            </span>
          </Link>

          <nav className="relative hidden items-center gap-1 xl:flex">
            <span
              className={cn(
                'pointer-events-none absolute -top-1 right-2 left-2 h-px bg-linear-to-r from-transparent via-teal-400/30 to-transparent',
                { 'via-[#6fa28c]/40': isCareers },
              )}
            />
            {NAV_LINKS.map((link) => (
              <AppButton
                key={link.id}
                isLink
                linkTo={`/${lng}${link.href}`}
                className={navBtnClasses}
                variant="nav"
              >
                {t(`header.nav.${link.id}`)}
              </AppButton>
            ))}
            <span
              className={cn(
                'pointer-events-none absolute right-2 -bottom-1 left-2 h-px bg-linear-to-r from-transparent via-teal-400/20 to-transparent',
                { 'via-[#6fa28c]/30': isCareers },
              )}
            />
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <Suspense
              fallback={
                <div
                  className={cn('h-9.5 w-22.5 animate-pulse rounded-xl bg-[#0a1210]', {
                    'rounded-sm': isCareers,
                  })}
                />
              }
            >
              <LanguageSwitcher theme={theme} />
            </Suspense>
            <div className={cn('h-6 w-px bg-white/10', { 'bg-[#4a5c52]/50': isCareers })} />

            <AppButton
              isLink
              linkTo="http://localhost:5173"
              variant="nav"
              className={cn('text-sm font-medium text-neutral-300 hover:text-white', navBtnClasses)}
            >
              {t('header.signIn')}
            </AppButton>
            <AppButton
              isLink
              variant={btnVariant}
              className={cn({ 'rounded-sm capitalize': isCareers })}
              newTab={false}
              linkTo="http://localhost:5173"
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
              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 p-0 text-white hover:bg-white/5 hover:text-white xl:hidden',
              {
                'rounded-sm border-[#4a5c52] bg-[#0a0e0d] text-[#9cc4b0] hover:border-[#6fa28c] hover:bg-[#141a16] hover:text-[#e8dcc8]':
                  isCareers,
              },
            )}
            aria-label={t('header.toggleMenu')}
          />
        </div>

        <div
          className={cn(
            'grid rounded-2xl border border-white/5 bg-black/40 backdrop-blur-lg transition-all duration-300 ease-in-out xl:hidden',
            isOpen
              ? 'pointer-events-auto visible my-2 grid-rows-[1fr] opacity-100'
              : 'pointer-events-none invisible mt-0 grid-rows-[0fr] opacity-0',
            {
              'rounded-sm border-[#4a5c52]/40 bg-[#0a0e0d]/95': isCareers,
            },
          )}
        >
          <div className="overflow-hidden">
            <div className="relative flex flex-col gap-1 p-4 sm:p-5">
              <span
                className={cn(
                  'pointer-events-none absolute inset-2 rounded-xl border border-dashed border-teal-400/15 sm:inset-2.5',
                  { 'rounded-sm border-[#6fa28c]/20': isCareers },
                )}
              />

              {NAV_LINKS.map((link) => (
                <AppButton
                  key={link.id}
                  isLink
                  linkTo={`/${lng}${link.href}`}
                  onClick={() => setIsOpen(false)}
                  variant="nav"
                  className={cn(
                    'h-auto w-full justify-start px-3 py-2.5 text-base text-neutral-300 hover:bg-white/5 hover:text-white',
                    {
                      'rounded-sm hover:bg-[#141a16] hover:text-[#e8dcc8] hover:after:bg-[#6fa28c] hover:after:shadow-[0_0_8px_rgba(111,162,140,0.8)]':
                        isCareers,
                    },
                  )}
                >
                  {t(`header.nav.${link.id}`)}
                </AppButton>
              ))}

              <div className="my-2 flex items-center gap-2 px-3">
                <span
                  className={cn(
                    'h-1 w-1 rounded-full bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]',
                    {
                      'bg-[#6fa28c]/60 shadow-[0_0_4px_rgba(111,162,140,0.6)]': isCareers,
                    },
                  )}
                />
                <span
                  className={cn(
                    'h-px flex-1 bg-linear-to-r from-teal-400/40 via-white/10 to-transparent',
                    { 'from-[#6fa28c]/40 via-[#4a5c52]/30': isCareers },
                  )}
                />
                <span
                  className={cn(
                    'h-1 w-1 rounded-full bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]',
                    {
                      'bg-[#6fa28c]/60 shadow-[0_0_4px_rgba(111,162,140,0.6)]': isCareers,
                    },
                  )}
                />
              </div>

              <div className="flex flex-col gap-3 pt-1 pb-1">
                <Suspense
                  fallback={
                    <div
                      className={cn('h-9.5 w-full animate-pulse rounded-xl bg-[#0a1210]', {
                        'rounded-sm': isCareers,
                      })}
                    />
                  }
                >
                  <LanguageSwitcher theme={theme} isMobile />
                </Suspense>

                <AppButton
                  isLink
                  linkTo={`http://localhost:5173`}
                  onClick={() => setIsOpen(false)}
                  variant="nav"
                  className={cn(
                    'h-auto w-full text-center text-sm font-medium text-neutral-300 hover:text-white',
                    {
                      'rounded-sm hover:bg-[#141a16] hover:text-[#e8dcc8] hover:after:bg-[#6fa28c]':
                        isCareers,
                    },
                  )}
                >
                  {t('header.signIn')}
                </AppButton>
                <AppButton
                  isLink
                  linkTo={`http://localhost:5173/`}
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  variant={btnVariant}
                  className={cn({ 'rounded-sm capitalize': isCareers })}
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
