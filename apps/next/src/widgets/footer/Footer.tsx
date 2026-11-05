import Link from 'next/link';
import PipelineLogo from '@/assets/logo.svg';
import { FOOTER_COLUMNS, SOCIALS } from './model';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-900 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-8 mb-16">
          <div className="col-span-2 flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="group flex items-center gap-2.5 text-white font-semibold text-lg tracking-tight"
              >
                <div className="h-6 w-11 flex items-center justify-center text-teal-400 transition-transform duration-300 group-hover:scale-110">
                  <PipelineLogo className="h-full w-full stroke-current" />
                </div>
                <span className="bg-linear-to-r from-white via-neutral-100 to-[#39b39b] bg-clip-text text-transparent font-medium transition-colors duration-300">
                  pipeline studio
                </span>
              </Link>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed max-w-xs">
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
                    className="p-2 bg-slate-900 border border-slate-800 hover:border-teal-500/30 hover:text-teal-400 text-slate-400 rounded-xl transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="col-span-1">
              <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest mb-5">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-400 hover:text-teal-400 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p className="text-slate-500">
            &copy; {CURRENT_YEAR} Pipelines Studio Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-2 px-3 py-1 bg-teal-500/5 border border-teal-500/10 rounded-full text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>All names are fictional</span>
          </div>
        </div>
      </div>
    </footer>
  );
}