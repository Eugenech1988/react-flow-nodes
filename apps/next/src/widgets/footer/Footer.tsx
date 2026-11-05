import Link from 'next/link';
import PipelineLogo from '@/assets/logo.svg';
import { FOOTER_COLUMNS, SOCIALS } from './model';
import { InfoBadge, Corner } from '@/shared/ui';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden pt-8 pb-6 md:pt-12">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="relative mx-auto w-[95%] max-w-7xl">
        <div className="relative w-full rounded-2xl border border-white/10 bg-white/6 px-5 py-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:bg-linear-to-b after:from-white/5 after:to-transparent after:opacity-50 sm:px-8 md:px-10 md:py-12">
          <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-teal-300/30 to-transparent md:inset-x-6" />
          <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-linear-to-r from-transparent via-teal-400/20 to-transparent md:inset-x-6" />

          <Corner type="tl" className="top-2 left-2 md:top-3 md:left-3" />
          <Corner type="tr" className="top-2 right-2 md:top-3 md:right-3" />
          <Corner type="bl" className="bottom-2 left-2 md:bottom-3 md:left-3" />
          <Corner type="br" className="right-2 bottom-2 md:right-3 md:bottom-3" />

          <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-10 md:mb-12 md:grid-cols-6 md:gap-8">
            <div className="col-span-2 flex flex-col justify-between">
              <div>
                <Link
                  href="/"
                  className="group flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white md:gap-3"
                >
                  <div className="flex h-6 w-9 shrink-0 items-center justify-center text-teal-400 transition-transform duration-300 group-hover:scale-110 md:w-11">
                    <PipelineLogo className="h-full w-full stroke-current drop-shadow-[0_0_8px_rgba(57,179,155,0.4)]" />
                  </div>
                  <span className="truncate bg-linear-to-r from-white via-neutral-100 to-[#39b39b] bg-clip-text text-sm font-medium tracking-widest whitespace-nowrap text-transparent uppercase transition-colors duration-300 sm:text-base md:text-lg md:tracking-[0.15em]">
                    pipeline studio
                  </span>
                </Link>
                <p className="mt-4 max-w-xs text-xs leading-relaxed text-neutral-400 md:mt-5">
                  An event-driven orchestration engine running at the edge. Connect services,
                  validate data payloads, and scale workflows instantly.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
                {SOCIALS.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 text-neutral-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-teal-500/30 hover:bg-white/10 hover:text-teal-400 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_0_15px_rgba(57,179,155,0.2)]"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="col-span-1">
                <h4 className="relative mb-5 font-mono text-[11px] font-bold tracking-[0.15em] text-neutral-200 uppercase md:mb-6 md:text-xs">
                  {column.title}
                  <span className="absolute -bottom-2 left-0 h-px w-6 bg-teal-400/50 shadow-[0_0_6px_rgba(57,179,155,0.5)]" />
                </h4>
                <ul className="space-y-3 md:space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="relative inline-block text-xs text-neutral-400 transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-teal-400/80 after:shadow-[0_0_6px_rgba(57,179,155,0.8)] after:transition-all hover:text-white hover:after:w-full"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="relative flex flex-col items-center justify-between gap-5 pt-6 font-mono text-xs sm:flex-row md:gap-4 md:pt-8">
            <div className="absolute top-0 right-0 left-0 flex items-center gap-2 opacity-50">
              <span className="h-1 w-1 rounded-full bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]" />
              <span className="h-px flex-1 bg-linear-to-r from-teal-400/40 via-white/10 to-transparent" />
              <span className="h-1 w-1 rounded-full bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]" />
            </div>

            <p className="w-full text-center leading-relaxed text-neutral-500 sm:text-left">
              &copy; {CURRENT_YEAR} Pipelines Studio Inc. All rights reserved.
            </p>

            <InfoBadge text="All names are fictional" />
          </div>
        </div>
      </div>
    </footer>
  );
};
