import Link from 'next/link';
import PipelineLogo from '@/assets/logo.svg';
import { Badge, Rivets, SocialLinks } from '@/shared/ui';
import { getT } from '@/shared/lib/i18n/server';
import { getFooterColumns } from './model';
import { cn } from '@/shared/lib';

const CURRENT_YEAR = new Date().getFullYear();

interface IFooterProps {
  theme?: 'default' | 'careers' | 'blog';
}

export const Footer = async ({ theme = 'default' }: IFooterProps) => {
  const { t, lng } = await getT('common');
  const FOOTER_COLUMNS = getFooterColumns(lng);

  const isBlog = theme === 'blog';
  const isCareers = theme === 'careers';
  const isTechnical = isCareers || isBlog;

  return (
    <footer className="relative w-full overflow-hidden pt-8 pb-6 md:pt-12">
      {isBlog && (
        <>
          <div className="bg-theme-accent absolute top-10 left-1/4 h-1 w-1 animate-pulse rounded-full shadow-[0_0_10px_var(--theme-accent)] motion-reduce:animate-none" />
          <div
            className="bg-theme-accent-hover absolute right-1/4 bottom-20 h-1 w-1 animate-pulse rounded-full shadow-[0_0_10px_var(--theme-accent-hover)] motion-reduce:animate-none"
            style={{ animationDelay: '1.5s' }}
          />
          <div
            className="bg-theme-accent absolute top-1/2 left-10 h-0.5 w-0.5 animate-pulse rounded-full shadow-[0_0_6px_var(--theme-accent)] motion-reduce:animate-none"
            style={{ animationDelay: '2.5s' }}
          />
        </>
      )}

      <div className="bg-theme-accent/5 pointer-events-none absolute bottom-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full blur-3xl" />

      <div className="relative mx-auto w-[95%] max-w-7xl">
        <div
          className={cn(
            'relative w-full px-5 py-8 sm:px-8 md:px-10 md:py-12',
            'border-theme-line bg-theme-header/80 border',
            'shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl',
            isTechnical ? 'rounded-sm' : 'rounded-2xl',
          )}
        >
          {isBlog && (
            <>
              <div className="border-theme-accent/10 pointer-events-none absolute inset-1 rounded-sm border" />
              <span className="border-theme-accent/70 pointer-events-none absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2" />
              <span className="border-theme-accent/70 pointer-events-none absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2" />
              <span className="border-theme-accent/70 pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2" />
              <span className="border-theme-accent/70 pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2" />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--theme-accent)_1px,transparent_1px),linear-gradient(90deg,var(--theme-accent)_1px,transparent_1px)] bg-size-[20px_20px] opacity-[0.02]" />
            </>
          )}

          <span className="via-theme-accent/30 md:via-theme-accent/60 pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent to-transparent md:inset-x-6 md:shadow-[0_0_8px_var(--theme-accent)]" />
          <span className="via-theme-accent/20 md:via-theme-accent/50 pointer-events-none absolute inset-x-4 bottom-0 h-px bg-linear-to-r from-transparent to-transparent md:inset-x-6" />

          {!isBlog && <Rivets />}

          <div className="relative z-10 mb-10 grid grid-cols-2 gap-x-6 gap-y-10 md:mb-12 md:grid-cols-6 md:gap-8">
            <div className="col-span-2 flex flex-col justify-between">
              <div>
                <Link href={`/${lng}`} className="group flex items-center gap-2.5 md:gap-3">
                  <div className="text-theme-accent relative flex h-6 w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 md:w-11">
                    {isBlog && (
                      <span className="border-theme-accent/40 absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-[spin_12s_linear_infinite] rounded-full border border-dashed motion-reduce:animate-none" />
                    )}
                    <PipelineLogo className="relative z-10 h-full w-full stroke-current drop-shadow-[0_0_8px_var(--theme-accent)]" />
                  </div>
                  <span className="to-theme-accent truncate bg-linear-to-r from-white via-white bg-clip-text text-sm font-medium tracking-widest whitespace-nowrap text-transparent uppercase sm:text-base md:text-lg md:tracking-[0.15em]">
                    pipeline studio
                  </span>
                </Link>
                <p className="text-theme-muted mt-4 max-w-xs text-sm leading-relaxed md:mt-5">
                  {t('footer.description')}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
                <SocialLinks theme={theme} size="sm" />
              </div>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.id} className="col-span-1">
                <h3 className="text-theme-fg relative mb-5 text-[11px] font-bold tracking-[0.15em] uppercase md:mb-6 md:text-xs">
                  {t(`footer.columns.${column.id}.title`)}
                  <span className="bg-theme-accent/50 absolute -bottom-2 left-0 h-px w-6 shadow-[0_0_6px_var(--theme-accent)]" />
                </h3>
                <ul className="space-y-3 md:space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="text-theme-muted after:bg-theme-accent hover:text-theme-fg relative inline-block text-sm transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:shadow-[0_0_6px_var(--theme-accent)] after:transition-all hover:after:w-full"
                      >
                        {t(`footer.columns.${column.id}.links.${link.id}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-5 pt-6 font-mono text-xs sm:flex-row md:gap-4 md:pt-8">
            <div className="absolute top-0 right-0 left-0 flex items-center gap-2 opacity-50">
              <span className="bg-theme-accent/60 h-1 w-1 rounded-full" />
              <span className="from-theme-accent/40 via-theme-line h-px flex-1 bg-linear-to-r to-transparent" />
              <span className="bg-theme-accent/60 h-1 w-1 rounded-full" />
            </div>

            <p className="text-theme-dim w-full text-center leading-relaxed sm:text-left">
              {t('footer.copyright', { year: CURRENT_YEAR })}
            </p>

            <Badge
              variant="pill"
              theme={theme}
              className={cn(
                isTechnical && 'border-theme-line bg-theme-surface/80 text-theme-muted shadow-none',
              )}
            >
              {t('footer.badge')}
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};
