import Link from 'next/link';
import PipelineLogo from '@/assets/logo.svg';
import { InfoBadge, SocialLinks } from '@/shared/ui';
import { getT } from '@/shared/lib/i18n/server';
import { Cog } from 'lucide-react';
import { getFooterColumns } from './model';
import { cn } from '@/shared/lib';

const CURRENT_YEAR = new Date().getFullYear();

interface TFooterProps {
  theme?: 'default' | 'careers';
}

export const Footer = async ({ theme = 'default' }: TFooterProps) => {
  const { t, lng } = await getT('common');
  const FOOTER_COLUMNS = getFooterColumns(lng);

  const isCareers = theme === 'careers';

  const cogClasses = cn('absolute h-4 w-4', isCareers ? 'text-[#6fa28c]/40' : 'text-teal-400/30');

  const dotClasses = cn(
    'h-1 w-1 rounded-full',
    isCareers
      ? 'bg-[#6fa28c]/60 shadow-[0_0_4px_rgba(111,162,140,0.6)]'
      : 'bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]',
  );

  return (
    <footer className="relative w-full overflow-hidden pt-8 pb-6 md:pt-12">
      <div
        className={cn(
          'pointer-events-none absolute bottom-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full blur-3xl',
          isCareers ? 'bg-[#6fa28c]/5' : 'bg-teal-500/5',
        )}
      />

      <div className="relative mx-auto w-[95%] max-w-7xl">
        <div
          className={cn(
            'relative w-full rounded-2xl border border-white/10 bg-white/6 px-5 py-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:bg-linear-to-b after:from-white/5 after:to-transparent after:opacity-50 sm:px-8 md:px-10 md:py-12',
            isCareers &&
              'rounded-sm border-[#4a5c52]/50 bg-[#0a0e0d]/80 after:rounded-sm after:from-[#4a5c52]/20',
          )}
        >
          <span
            className={cn(
              'pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent to-transparent md:inset-x-6',
              isCareers ? 'via-[#6fa28c]/50' : 'via-teal-300/30',
            )}
          />
          <span
            className={cn(
              'pointer-events-none absolute inset-x-4 bottom-0 h-px bg-linear-to-r from-transparent to-transparent md:inset-x-6',
              isCareers ? 'via-[#6fa28c]/30' : 'via-teal-400/20',
            )}
          />

          {[
            'top-3 left-3 md:top-5 md:left-5',
            'top-3 right-3 md:top-5 md:right-5',
            'bottom-3 left-3 md:bottom-5 md:left-5',
            'bottom-3 right-3 md:bottom-5 md:right-5',
          ].map((position) => (
            <Cog key={position} className={cn(cogClasses, position)} />
          ))}

          <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-10 md:mb-12 md:grid-cols-6 md:gap-8">
            <div className="col-span-2 flex flex-col justify-between">
              <div>
                <Link
                  href={`/${lng}`}
                  className="group flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white md:gap-3"
                >
                  <div
                    className={cn(
                      'flex h-6 w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110 md:w-11',
                      isCareers ? 'text-[#6fa28c]' : 'text-teal-400',
                    )}
                  >
                    <PipelineLogo
                      className={cn(
                        'h-full w-full stroke-current',
                        isCareers
                          ? 'drop-shadow-[0_0_8px_rgba(111,162,140,0.6)]'
                          : 'drop-shadow-[0_0_8px_rgba(57,179,155,0.4)]',
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'truncate bg-clip-text text-sm font-medium tracking-widest whitespace-nowrap text-transparent uppercase transition-colors duration-300 sm:text-base md:text-lg md:tracking-[0.15em]',
                      isCareers
                        ? 'bg-linear-to-r from-[#d4cfc0] via-[#d4cfc0] to-[#6fa28c]'
                        : 'bg-linear-to-r from-white via-neutral-100 to-[#39b39b]',
                    )}
                  >
                    pipeline studio
                  </span>
                </Link>
                <p
                  className={cn(
                    'mt-4 max-w-xs text-sm leading-relaxed md:mt-5',
                    isCareers ? 'text-[#8a9488]' : 'text-neutral-400',
                  )}
                >
                  {t('footer.description')}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
                <SocialLinks theme="careers" size="sm" />
              </div>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.id} className="col-span-1">
                <h3
                  className={cn(
                    'relative mb-5 text-[11px] font-bold tracking-[0.15em] uppercase md:mb-6 md:text-xs',
                    isCareers ? 'text-[#d4cfc0]' : 'text-neutral-200',
                  )}
                >
                  {t(`footer.columns.${column.id}.title`)}
                  <span
                    className={cn(
                      'absolute -bottom-2 left-0 h-px w-6',
                      isCareers
                        ? 'bg-[#6fa28c]/50 shadow-[0_0_6px_rgba(111,162,140,0.5)]'
                        : 'bg-teal-400/50 shadow-[0_0_6px_rgba(57,179,155,0.5)]',
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
                          isCareers
                            ? 'text-[#8a9488] after:bg-[#6fa28c] after:shadow-[0_0_6px_rgba(111,162,140,0.8)] hover:text-[#d4cfc0]'
                            : 'text-neutral-400 after:bg-teal-400/80 after:shadow-[0_0_6px_rgba(57,179,155,0.8)] hover:text-white',
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

          <div className="relative flex flex-col items-center justify-between gap-5 pt-6 font-mono text-xs sm:flex-row md:gap-4 md:pt-8">
            <div className="absolute top-0 right-0 left-0 flex items-center gap-2 opacity-50">
              <span className={dotClasses} />
              <span
                className={cn(
                  'h-px flex-1 bg-linear-to-r',
                  isCareers
                    ? 'from-[#6fa28c]/40 via-[#4a5c52]/30 to-transparent'
                    : 'from-teal-400/40 via-white/10 to-transparent',
                )}
              />
              <span className={dotClasses} />
            </div>

            <p
              className={cn(
                'w-full text-center leading-relaxed sm:text-left',
                isCareers ? 'text-[#4a5c52]' : 'text-neutral-500',
              )}
            >
              {t('footer.copyright', { year: CURRENT_YEAR })}
            </p>

            <InfoBadge
              text={t('footer.badge')}
              theme={theme}
              className={cn(
                isCareers && 'border-[#4a5c52]/50 bg-[#0a0e0d] text-[#8a9488] shadow-none',
              )}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
