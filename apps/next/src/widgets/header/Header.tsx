'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '@/widgets/header/model';
import PipelineLogo from '@/assets/logo.svg';
import { Button } from '@pipeline/ui';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2 transition-all duration-300">
      <div className="relative w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] backdrop-blur-md after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:bg-linear-to-b after:from-white/5 after:to-transparent after:opacity-50">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white"
          >
            <div className="flex h-6 w-11 items-center justify-center text-teal-400 transition-transform duration-300 group-hover:scale-110">
              <PipelineLogo className="h-full w-full stroke-current" />
            </div>
            <span className="bg-linear-to-r from-white via-neutral-100 to-[#39b39b] bg-clip-text font-medium text-transparent transition-colors duration-300">
              pipeline studio
            </span>
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.text}
              </Link>
            ))}
          </nav>

          {/* Десктопные кнопки справа */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
            >
              Sign in
            </Link>
            <Button className="relative overflow-hidden rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-neutral-950 transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-[0_0_20px_rgba(57,179,155,0.4)]">
              <Link href="/start">Get started</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <div
          className={`grid rounded-xl border border-white/5 bg-black/40 backdrop-blur-lg transition-[grid-template-rows,opacity,margin-top] duration-300 ease-in-out md:hidden ${
            isOpen
              ? 'pointer-events-auto mt-4 grid-rows-[1fr] opacity-100'
              : 'pointer-events-none mt-0 grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2 p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base text-neutral-300 hover:bg-white/5 hover:text-white"
                >
                  {link.text}
                </Link>
              ))}
              <hr className="my-2 border-white/10" />
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-sm font-medium text-neutral-300 hover:text-white"
                >
                  Sign in
                </Link>
                <Button className="rounded-xl bg-white py-2.5 text-center text-sm font-semibold text-neutral-950 transition-all duration-300 hover:bg-neutral-100">
                  <Link href="/start" onClick={() => setIsOpen(false)}>
                    Get started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
