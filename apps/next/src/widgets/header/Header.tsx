'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import PipelineLogo from '@/assets/logo.svg';
import { AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from './model';
import { LanguageSwitcher } from '@/features';

export const Header = () => {
  const { t, i18n } = useT('common');
  const lng = i18n.language;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2 transition-all duration-300">
      <div className="relative w-full rounded-2xl border border-white/10 bg-white/6 px-5 py-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:bg-linear-to-b after:from-white/5 after:to-transparent after:opacity-50 sm:px-8 xl:px-10">
        <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-teal-300/30 to-transparent md:inset-x-5" />
        <span className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-linear-to-r from-transparent via-teal-400/20 to-transparent md:inset-x-5" />

        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/${lng}`}
            onClick={(e) => {
              if (window.location.pathname === `/${lng}`) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="group flex min-w-0 flex-1 items-center gap-2.5 text-lg font-semibold tracking-tight text-white xl:flex-none xl:gap-3"
          >
            <div className="flex h-6 w-9 shrink-0 items-center justify-center text-teal-400 transition-transform duration-300 group-hover:scale-110 md:w-11">
              <PipelineLogo className="h-full w-full stroke-current drop-shadow-[0_0_8px_rgba(57,179,155,0.4)]" />
            </div>
            <span className="truncate bg-linear-to-r from-white via-neutral-100 to-[#39b39b] bg-clip-text text-sm font-medium tracking-widest whitespace-nowrap text-transparent uppercase transition-colors duration-300 sm:text-base xl:text-lg xl:tracking-[0.15em]">
              pipeline studio
            </span>
          </Link>

          <nav className="relative hidden items-center gap-1 xl:flex">
            <span className="pointer-events-none absolute -top-1 right-2 left-2 h-px bg-linear-to-r from-transparent via-teal-400/30 to-transparent" />
            {NAV_LINKS.map((link) => (
              <AppButton key={link.id} isLink linkTo={`/${lng}${link.href}`} variant="nav">
                {t(`header.nav.${link.id}`)}
              </AppButton>
            ))}
            <span className="pointer-events-none absolute right-2 -bottom-1 left-2 h-px bg-linear-to-r from-transparent via-teal-400/20 to-transparent" />
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <Suspense
              fallback={<div className="h-9.5 w-22.5 animate-pulse rounded-xl bg-[#0a1210]" />}
            >
              <LanguageSwitcher />
            </Suspense>
            <div className="h-6 w-px bg-white/10" />

            <AppButton
              isLink
              linkTo={`http://localhost:5173/login`}
              variant="nav"
              className="text-sm font-medium text-neutral-300 hover:text-white"
            >
              {t('header.signIn')}
            </AppButton>
            <AppButton
              isLink
              linkTo={`http://localhost:5173/login`}
              size="sm"
              className="relative overflow-hidden rounded-xl bg-white font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-[0_0_20px_rgba(57,179,155,0.4)]"
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
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 p-0 text-white hover:bg-white/5 hover:text-white xl:hidden"
            aria-label={t('header.toggleMenu')}
          />
        </div>

        <div
          className={`grid rounded-2xl border border-white/5 bg-black/40 backdrop-blur-lg transition-all duration-300 ease-in-out xl:hidden ${
            isOpen
              ? 'pointer-events-auto visible my-2 grid-rows-[1fr] opacity-100'
              : 'pointer-events-none invisible mt-0 grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="relative flex flex-col gap-1 p-4 sm:p-5">
              <span className="pointer-events-none absolute inset-2 rounded-xl border border-dashed border-teal-400/15 sm:inset-2.5" />

              {NAV_LINKS.map((link) => (
                <AppButton
                  key={link.id}
                  isLink
                  linkTo={`/${lng}${link.href}`}
                  onClick={() => setIsOpen(false)}
                  variant="nav"
                  className="h-auto w-full justify-start px-3 py-2.5 text-base text-neutral-300 hover:bg-white/5 hover:text-white"
                >
                  {t(`header.nav.${link.id}`)}
                </AppButton>
              ))}

              <div className="my-2 flex items-center gap-2 px-3">
                <span className="h-1 w-1 rounded-full bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]" />
                <span className="h-px flex-1 bg-linear-to-r from-teal-400/40 via-white/10 to-transparent" />
                <span className="h-1 w-1 rounded-full bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]" />
              </div>

              <div className="flex flex-col gap-3 pt-1 pb-1">
                <div className="px-3">
                  <Suspense
                    fallback={
                      <div className="h-9.5 w-full animate-pulse rounded-xl bg-[#0a1210]" />
                    }
                  >
                    <LanguageSwitcher isMobile />
                  </Suspense>
                </div>

                <AppButton
                  isLink
                  linkTo={`/${lng}/login`}
                  onClick={() => setIsOpen(false)}
                  variant="nav"
                  className="h-auto w-full text-center text-sm font-medium text-neutral-300 hover:text-white"
                >
                  {t('header.signIn')}
                </AppButton>
                <AppButton
                  isLink
                  linkTo={`/${lng}/start`}
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  className="mx-auto h-auto w-[90%] rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-slate-950 hover:bg-neutral-100"
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
