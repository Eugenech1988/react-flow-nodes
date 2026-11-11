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

interface IHeaderProps {
  locale: string;
  theme?: 'default' | 'careers' | 'blog';
}

export const Header = ({ locale, theme = 'default' }: IHeaderProps) => {
  const { t } = useT('common');
  const [isOpen, setIsOpen] = useState(false);

  const isCareers = theme === 'careers';
  const isBlog = theme === 'blog';
  const isThemed = isCareers || isBlog;

  const btnVariant = isCareers ? 'careers' : isBlog ? 'blog' : 'primary';

  const navBtnClasses = cn({
    'rounded-sm hover:after:bg-[#6fa28c] hover:after:shadow-[0_0_8px_rgba(111,162,140,0.8)] hover:text-[#e8dcc8]':
    isCareers,
    'rounded-sm hover:after:bg-[#2dd4bf] hover:after:shadow-[0_0_8px_rgba(45,212,191,0.8)] hover:text-[#5eead4]':
    isBlog,
  });

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2 transition-all duration-300">
      <div
        className={cn(
          'relative w-full px-5 py-2.5 sm:px-8 xl:px-10',
          !isBlog &&
          'rounded-2xl border border-white/10 bg-white/6 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:bg-linear-to-b after:from-white/5 after:to-transparent after:opacity-50',
          isCareers &&
          'rounded-sm border-[#4a5c52]/50 bg-[#0a0e0d]/80 after:rounded-sm after:from-[#4a5c52]/20',
          isBlog &&
          'rounded-sm border border-[#1E293B] bg-[#050B14]/80 shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(45,212,191,0.1)] backdrop-blur-xl',
        )}
      >
        {isBlog && (
          <>
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[16px_16px]" />

            <div className="pointer-events-none absolute inset-1 border border-[#2dd4bf]/10" />

            <span className="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-[#2dd4bf]/70" />
            <span className="pointer-events-none absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-[#2dd4bf]/70" />
            <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#2dd4bf]/70" />
            <span className="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-[#2dd4bf]/70" />

            <span className="pointer-events-none absolute top-1/2 left-1/2 h-10 w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.08),transparent_70%)] blur-md" />
          </>
        )}

        <span
          className={cn(
            'pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-teal-300/30 to-transparent md:inset-x-5',
            isCareers && 'via-[#6fa28c]/50',
            isBlog && 'via-[#2dd4bf]/50 shadow-[0_0_8px_rgba(45,212,191,0.4)]',
          )}
        />
        <span
          className={cn(
            'pointer-events-none absolute inset-x-3 bottom-0 h-px bg-linear-to-r from-transparent via-teal-400/20 to-transparent md:inset-x-5',
            isCareers && 'via-[#6fa28c]/30',
            isBlog && 'via-[#2dd4bf]/20',
          )}
        />

        <div className="relative z-10 flex items-center justify-between gap-2">
          <Link
            href={`/${locale}`}
            className="group flex min-w-0 flex-1 items-center gap-2.5 text-lg font-semibold tracking-tight text-white xl:flex-none xl:gap-3"
          >
            <div
              className={cn(
                'relative flex h-6 w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 md:w-11',
                isCareers && 'text-[#6fa28c]',
                isBlog && 'text-[#2dd4bf]',
                !isThemed && 'text-teal-400',
              )}
            >
              {isBlog && (
                <>
                  <span className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-[spin_12s_linear_infinite] rounded-full border border-dashed border-[#2dd4bf]/40" />
                  <span className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2dd4bf]/10" />
                </>
              )}
              <PipelineLogo
                className={cn(
                  'relative z-10 h-full w-full stroke-current',
                  isCareers && 'drop-shadow-[0_0_8px_rgba(111,162,140,0.6)]',
                  isBlog && 'drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]',
                  !isThemed && 'drop-shadow-[0_0_8px_rgba(57,179,155,0.4)]',
                )}
              />
            </div>
            <span
              className={cn(
                'truncate bg-clip-text text-sm font-medium tracking-widest whitespace-nowrap text-transparent uppercase transition-colors duration-300 sm:text-base xl:text-lg xl:tracking-[0.15em]',
                isCareers && 'bg-linear-to-r from-white via-neutral-100 to-[#9cc4b0]',
                isBlog && 'bg-linear-to-r from-white via-[#e2e8f0] to-[#2dd4bf]',
                !isThemed && 'bg-linear-to-r from-white via-neutral-100 to-[#39b39b]',
              )}
            >
              pipeline studio
            </span>
          </Link>

          <nav className="relative hidden items-center gap-1 xl:flex">
            <span
              className={cn(
                'pointer-events-none absolute -top-1 right-2 left-2 h-px bg-linear-to-r from-transparent via-teal-400/30 to-transparent',
                isCareers && 'via-[#6fa28c]/40',
                isBlog && 'via-[#2dd4bf]/40',
              )}
            />
            {NAV_LINKS.map((link) => (
              <AppButton
                key={link.id}
                isLink
                linkTo={`/${locale}${link.href}`}
                className={navBtnClasses}
                variant="nav"
              >
                {t(`header.nav.${link.id}`)}
              </AppButton>
            ))}
            <span
              className={cn(
                'pointer-events-none absolute right-2 -bottom-1 left-2 h-px bg-linear-to-r from-transparent via-teal-400/20 to-transparent',
                isCareers && 'via-[#6fa28c]/30',
                isBlog && 'via-[#2dd4bf]/20',
              )}
            />
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <LanguageSwitcher locale={locale} theme={theme} />

            <div
              className={cn(
                'relative h-6 w-px bg-white/10',
                isCareers && 'bg-[#4a5c52]/50',
                isBlog && 'bg-[#1E293B]',
              )}
            >
              {isBlog && (
                <>
                  <span className="absolute top-0 left-0 h-1.5 w-px bg-[#2dd4bf]/80" />
                  <span className="absolute bottom-0 left-0 h-1.5 w-px bg-[#2dd4bf]/80" />
                </>
              )}
            </div>

            <AppButton
              isLink
              linkTo="http://localhost:5173/login"
              variant="nav"
              className={cn('text-sm font-medium text-neutral-300 hover:text-white', navBtnClasses)}
            >
              {t('header.signIn')}
            </AppButton>
            <AppButton
              isLink
              variant={btnVariant}
              className={cn({ 'rounded-sm capitalize': isThemed })}
              newTab={false}
              linkTo="http://localhost:5173/login"
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
                'rounded-sm border-[#1E293B] bg-[#050B14] text-[#2dd4bf] hover:border-[#2dd4bf]/60 hover:bg-[#0B1424]':
                isBlog,
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
              'rounded-sm border-[#1E293B] bg-[#050B14]/95': isBlog,
            },
          )}
        >
          <div className="overflow-hidden">
            <div className="relative flex flex-col gap-1 p-4 sm:p-5">
              <span
                className={cn(
                  'pointer-events-none absolute inset-2 rounded-xl border border-dashed border-teal-400/15 sm:inset-2.5',
                  isThemed && 'rounded-sm border-[#6fa28c]/20',
                  isBlog && 'border-[#2dd4bf]/30',
                )}
              />

              {NAV_LINKS.map((link) => (
                <AppButton
                  key={link.id}
                  isLink
                  linkTo={`/${locale}${link.href}`}
                  onClick={() => setIsOpen(false)}
                  variant="nav"
                  className={cn(
                    'h-auto w-full justify-start px-3 py-2.5 text-base text-neutral-300 hover:bg-white/5 hover:text-white',
                    {
                      'rounded-sm hover:bg-[#141a16] hover:text-[#e8dcc8] hover:after:bg-[#6fa28c] hover:after:shadow-[0_0_8px_rgba(111,162,140,0.8)]':
                      isCareers,
                      'rounded-sm hover:bg-[#0B1424] hover:text-[#5eead4] hover:after:bg-[#2dd4bf] hover:after:shadow-[0_0_8px_rgba(45,212,191,0.8)]':
                      isBlog,
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
                    isCareers && 'bg-[#6fa28c]/60 shadow-[0_0_4px_rgba(111,162,140,0.6)]',
                    isBlog && 'bg-[#2dd4bf]/60 shadow-[0_0_4px_rgba(45,212,191,0.6)]',
                  )}
                />
                <span
                  className={cn(
                    'h-px flex-1 bg-linear-to-r from-teal-400/40 via-white/10 to-transparent',
                    isCareers && 'from-[#6fa28c]/40 via-[#4a5c52]/30',
                    isBlog && 'from-[#2dd4bf]/40 via-[#1E293B]',
                  )}
                />
                <span
                  className={cn(
                    'h-1 w-1 rounded-full bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]',
                    isCareers && 'bg-[#6fa28c]/60 shadow-[0_0_4px_rgba(111,162,140,0.6)]',
                    isBlog && 'bg-[#2dd4bf]/60 shadow-[0_0_4px_rgba(45,212,191,0.6)]',
                  )}
                />
              </div>

              <div className="flex flex-col gap-3 pt-1 pb-1">
                <LanguageSwitcher locale={locale} theme={theme} isMobile />

                <AppButton
                  isLink
                  linkTo="http://localhost:5173/login"
                  onClick={() => setIsOpen(false)}
                  variant="nav"
                  className={cn(
                    'h-auto w-full text-center text-sm font-medium text-neutral-300 hover:text-white',
                    {
                      'rounded-sm hover:bg-[#141a16] hover:text-[#e8dcc8] hover:after:bg-[#6fa28c]':
                      isCareers,
                      'rounded-sm hover:bg-[#0B1424] hover:text-[#5eead4] hover:after:bg-[#2dd4bf]':
                      isBlog,
                    },
                  )}
                >
                  {t('header.signIn')}
                </AppButton>
                <AppButton
                  isLink
                  linkTo="http://localhost:5173/login"
                  onClick={() => setIsOpen(false)}
                  size="md"
                  variant={btnVariant}
                  className={cn({ 'rounded-sm capitalize': isThemed })}
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