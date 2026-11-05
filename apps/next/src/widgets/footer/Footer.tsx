import Link from 'next/link';
import PipelineLogo from '@/assets/logo.svg';
import { FOOTER_COLUMNS, SOCIALS } from './model';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-slate-900 bg-slate-950">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-5 md:gap-8">
          <div className="col-span-2 flex flex-col justify-between">
            <div>
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
              <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-400">
                An event-driven orchestration engine running at the edge. Connect services, validate
                data payloads, and scale workflows instantly.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              {SOCIALS.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 transition-all duration-300 hover:border-teal-500/30 hover:text-teal-400"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="col-span-1">
              <h4 className="mb-5 font-mono text-xs font-bold tracking-widest text-slate-200 uppercase">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-400 transition-colors duration-300 hover:text-teal-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-900/80 pt-8 font-mono text-xs sm:flex-row">
          <p className="text-slate-500">
            &copy; {CURRENT_YEAR} Pipelines Studio Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-2 rounded-full border border-teal-500/10 bg-teal-500/5 px-3 py-1 text-teal-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
            <span>All names are fictional</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
