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

  const isCareers = theme === 'careers';
  const isBlog = theme === 'blog';
  const isThemed = isCareers || isBlog;

  const dotClasses = cn(
    'h-1 w-1 rounded-full',
    isCareers && 'bg-[#6fa28c]/60 shadow-[0_0_4px_rgba(111,162,140,0.6)]',
    isBlog && 'bg-blog-accent/60 shadow-[0_0_4px_rgba(45,212,191,0.6)]',
    !isThemed && 'bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]',
  );

  return (
    <footer className="relative w-full overflow-hidden pt-8 pb-6 md:pt-12">
      {isBlog && (
        <>
          <div className="absolute top-10 left-1/4 h-1 w-1 animate-pulse rounded-full bg-blog-text shadow-[0_0_10px_var(--color-blog-text)] motion-reduce:animate-none" />
          <div className="absolute right-1/4 bottom-20 h-1 w-1 animate-pulse rounded-full bg-blog-accent shadow-[0_0_10px_var(--color-blog-accent)] motion-reduce:animate-none" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-10 h-0.5 w-0.5 animate-pulse rounded-full bg-blog-accent-hover shadow-[0_0_6px_var(--color-blog-accent-hover)] motion-reduce:animate-none" style={{ animationDelay: '2.5s' }} />
        </>
      )}

      <div
        className={cn(
          'pointer-events-none absolute bottom-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full blur-3xl',
          isCareers && 'bg-[#6fa28c]/5',
          isBlog && 'bg-blog-accent/5',
          !isThemed && 'bg-teal-500/5',
        )}
      />

      <div className="relative mx-auto w-[95%] max-w-7xl">
        <div
          className={cn(
            'relative w-full px-5 py-8 sm:px-8 md:px-10 md:py-12',
            !isBlog &&
            'rounded-2xl border border-white/10 bg-white/6 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:bg-linear-to-b after:from-white/5 after:to-transparent after:opacity-50',
            isCareers &&
            'rounded-sm border-[#4a5c52]/50 bg-[#0a0e0d]/80 after:rounded-sm after:from-[#4a5c52]/20',
            isBlog &&
            'rounded-sm border border-blog-border bg-blog-surface/80 shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(45,212,191,0.1)] backdrop-blur-xl',
          )}
        >
          {isBlog && (
            <>
              <div className="pointer-events-none absolute inset-1 border border-blog-accent/10" />
              <span className="pointer-events-none absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-blog-accent/70" />
              <span className="pointer-events-none absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-blog-accent/70" />
              <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-blog-accent/70" />
              <span className="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-blog-accent/70" />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.02)_1px,transparent_1px)] bg-size-[20px_20px]" />
            </>
          )}

          <span
            className={cn(
              'pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent to-transparent md:inset-x-6',
              isCareers && 'via-[#6fa28c]/50',
              isBlog && 'via-blog-accent/50 shadow-[0_0_8px_rgba(45,212,191,0.4)]',
              !isThemed && 'via-teal-300/30',
            )}
          />
          <span
            className={cn(
              'pointer-events-none absolute inset-x-4 bottom-0 h-px bg-linear-to-r from-transparent to-transparent md:inset-x-6',
              isCareers && 'via-[#6fa28c]/30',
              isBlog && 'via-blog-text/20',
              !isThemed && 'via-teal-400/20',
            )}
          />

          {!isBlog && <Rivets/>}

          <div className="relative z-10 mb-10 grid grid-cols-2 gap-x-6 gap-y-10 md:mb-12 md:grid-cols-6 md:gap-8">
            <div className="col-span-2 flex flex-col justify-between">
              <div>
                <Link
                  href={`/${lng}`}
                  className="group flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white md:gap-3"
                >
                  <div
                    className={cn(
                      'flex h-6 w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 md:w-11',
                      isCareers && 'text-[#6fa28c]',
                      isBlog && 'text-blog-accent',
                      !isThemed && 'text-teal-400',
                    )}
                  >
                    <PipelineLogo
                      className={cn(
                        'h-full w-full stroke-current',
                        isCareers && 'drop-shadow-[0_0_8px_rgba(111,162,140,0.6)]',
                        isBlog && 'drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]',
                        !isThemed && 'drop-shadow-[0_0_8px_rgba(57,179,155,0.4)]',
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'truncate bg-clip-text text-sm font-medium tracking-widest whitespace-nowrap text-transparent uppercase transition-colors duration-300 sm:text-base md:text-lg md:tracking-[0.15em]',
                      isCareers && 'bg-linear-to-r from-[#d4cfc0] via-[#d4cfc0] to-[#6fa28c]',
                      isBlog && 'bg-linear-to-r from-white via-blog-text to-blog-accent',
                      !isThemed && 'bg-linear-to-r from-white via-neutral-100 to-[#39b39b]',
                    )}
                  >
                    pipeline studio
                  </span>
                </Link>
                <p
                  className={cn(
                    'mt-4 max-w-xs text-sm leading-relaxed md:mt-5',
                    isCareers && 'text-[#8a9488]',
                    isBlog && 'text-blog-dim',
                    !isThemed && 'text-neutral-400',
                  )}
                >
                  {t('footer.description')}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
                <SocialLinks theme={isBlog ? 'blog' : theme} size="sm" />
              </div>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.id} className="col-span-1">
                <h3
                  className={cn(
                    'relative mb-5 text-[11px] font-bold tracking-[0.15em] uppercase md:mb-6 md:text-xs',
                    isCareers && 'text-[#d4cfc0]',
                    isBlog && 'text-blog-text',
                    !isThemed && 'text-neutral-200',
                  )}
                >
                  {t(`footer.columns.${column.id}.title`)}
                  <span
                    className={cn(
                      'absolute -bottom-2 left-0 h-px w-6',
                      isCareers && 'bg-[#6fa28c]/50 shadow-[0_0_6px_rgba(111,162,140,0.5)]',
                      isBlog && 'bg-blog-accent/50 shadow-[0_0_6px_rgba(45,212,191,0.5)]',
                      !isThemed && 'bg-teal-400/50 shadow-[0_0_6px_rgba(57,179,155,0.5)]',
                    )}
                  />
                </h3>
                <ul className="space-y-3 md:space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className={cn(
                          'relative inline-block text-sm transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:transition-all hover:after:w-full',
                          isCareers &&
                          'text-[#8a9488] after:bg-[#6fa28c] after:shadow-[0_0_6px_rgba(111,162,140,0.8)] hover:text-[#d4cfc0]',
                          isBlog &&
                          'text-blog-dim after:bg-blog-accent after:shadow-[0_0_6px_rgba(45,212,191,0.8)] hover:text-blog-accent',
                          !isThemed &&
                          'text-neutral-400 after:bg-teal-400/80 after:shadow-[0_0_6px_rgba(57,179,155,0.8)] hover:text-white',
                        )}
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
              <span className={dotClasses} />
              <span
                className={cn(
                  'h-px flex-1 bg-linear-to-r',
                  isCareers && 'from-[#6fa28c]/40 via-[#4a5c52]/30 to-transparent',
                  isBlog && 'from-blog-accent/40 via-blog-border to-transparent',
                  !isThemed && 'from-teal-400/40 via-white/10 to-transparent',
                )}
              />
              <span className={dotClasses} />
            </div>

            <p
              className={cn(
                'w-full text-center leading-relaxed sm:text-left',
                isCareers && 'text-[#4a5c52]',
                isBlog && 'text-blog-dim',
                !isThemed && 'text-neutral-500',
              )}
            >
              {t('footer.copyright', { year: CURRENT_YEAR })}
            </p>

            <Badge
              variant="pill"
              theme={isBlog ? 'blog' : theme}
              className={cn(
                isCareers && 'border-[#4a5c52]/50 bg-[#0a0e0d] text-[#8a9488] shadow-none',
                isBlog && 'border-blog-border bg-blog-surface/80 text-blog-muted shadow-none',
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