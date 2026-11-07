import Link from 'next/link';
import PipelineLogo from '@/assets/logo.svg';
import { InfoBadge } from '@/shared/ui';
import { getT } from '@/shared/lib/i18n/server';
import { Cog } from 'lucide-react';
import { getFooterColumns, SOCIALS } from './model';
import { cn } from '@/shared/lib';

const CURRENT_YEAR = new Date().getFullYear();

interface TFooterProps {
  theme?: 'default' | 'steampunk';
}

export const Footer = async ({ theme = 'default' }: TFooterProps) => {
  const { t, lng } = await getT('common');
  const FOOTER_COLUMNS = getFooterColumns(lng);

  const isSteampunk = theme === 'steampunk';

  return (
    <footer className="relative w-full overflow-hidden pt-8 pb-6 md:pt-12">
      <div
        className={cn(
          'pointer-events-none absolute bottom-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full blur-3xl',
          {
            'bg-teal-500/5': !isSteampunk,
            'bg-[#6fa28c]/5': isSteampunk,
          }
        )}
      />

      <div className="relative mx-auto w-[95%] max-w-7xl">
        <div
          className={cn(
            'relative w-full rounded-2xl border border-white/10 bg-white/6 px-5 py-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md after:absolute after:inset-0 after:-z-10 after:rounded-2xl after:bg-linear-to-b after:from-white/5 after:to-transparent after:opacity-50 sm:px-8 md:px-10 md:py-12',
            {
              'rounded-sm border-[#4a5c52]/50 bg-[#0a0e0d]/80 after:rounded-sm after:from-[#4a5c52]/20':
              isSteampunk,
            }
          )}
        >
          <span
            className={cn(
              'pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-teal-300/30 to-transparent md:inset-x-6',
              { 'via-[#6fa28c]/50': isSteampunk }
            )}
          />
          <span
            className={cn(
              'pointer-events-none absolute inset-x-4 bottom-0 h-px bg-linear-to-r from-transparent via-teal-400/20 to-transparent md:inset-x-6',
              { 'via-[#6fa28c]/30': isSteampunk }
            )}
          />

          <Cog
            className={cn('absolute top-3 left-3 h-4 w-4 md:top-5 md:left-5', {
              'text-teal-400/30': !isSteampunk,
              'text-[#6fa28c]/40': isSteampunk,
            })}
          />
          <Cog
            className={cn('absolute top-3 right-3 h-4 w-4 md:top-5 md:right-5', {
              'text-teal-400/30': !isSteampunk,
              'text-[#6fa28c]/40': isSteampunk,
            })}
          />
          <Cog
            className={cn('absolute bottom-3 left-3 h-4 w-4 md:bottom-5 md:left-5', {
              'text-teal-400/30': !isSteampunk,
              'text-[#6fa28c]/40': isSteampunk,
            })}
          />
          <Cog
            className={cn('absolute right-3 bottom-3 h-4 w-4 md:right-5 md:bottom-5', {
              'text-teal-400/30': !isSteampunk,
              'text-[#6fa28c]/40': isSteampunk,
            })}
          />

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
                      {
                        'text-teal-400': !isSteampunk,
                        'text-[#6fa28c]': isSteampunk,
                      }
                    )}
                  >
                    <PipelineLogo
                      className={cn(
                        'h-full w-full stroke-current',
                        {
                          'drop-shadow-[0_0_8px_rgba(57,179,155,0.4)]': !isSteampunk,
                          'drop-shadow-[0_0_8px_rgba(111,162,140,0.6)]': isSteampunk,
                        }
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'truncate bg-clip-text text-sm font-medium tracking-widest whitespace-nowrap text-transparent uppercase transition-colors duration-300 sm:text-base md:text-lg md:tracking-[0.15em]',
                      {
                        'bg-linear-to-r from-white via-neutral-100 to-[#39b39b]': !isSteampunk,
                        'bg-linear-to-r from-[#d4cfc0] via-[#d4cfc0] to-[#6fa28c]': isSteampunk,
                      }
                    )}
                  >
                    pipeline studio
                  </span>
                </Link>
                <p
                  className={cn('mt-4 max-w-xs text-sm leading-relaxed md:mt-5', {
                    'text-neutral-400': !isSteampunk,
                    'text-[#8a9488]': isSteampunk,
                  })}
                >
                  {t('footer.description')}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8">
                {SOCIALS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`footer.socials.${social.id}`)}
                      className={cn(
                        'relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.35)] transition-all duration-300',
                        {
                          'text-neutral-400 hover:border-teal-500/30 hover:bg-white/10 hover:text-teal-400 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_0_15px_rgba(57,179,155,0.2)]': !isSteampunk,
                          'rounded-sm border-[#2f3d36] bg-[#0a0e0d] text-[#8a9488] shadow-none hover:border-[#6fa28c] hover:bg-[#141a16] hover:text-[#9cc4b0] hover:shadow-[0_0_15px_rgba(111,162,140,0.2)]': isSteampunk,
                        }
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.id} className="col-span-1">
                <h4
                  className={cn(
                    'relative mb-5 text-[11px] font-bold tracking-[0.15em] uppercase md:mb-6 md:text-xs',
                    {
                      'text-neutral-200': !isSteampunk,
                      'text-[#d4cfc0]': isSteampunk,
                    }
                  )}
                >
                  {t(`footer.columns.${column.id}.title`)}
                  <span
                    className={cn(
                      'absolute -bottom-2 left-0 h-px w-6',
                      {
                        'bg-teal-400/50 shadow-[0_0_6px_rgba(57,179,155,0.5)]': !isSteampunk,
                        'bg-[#6fa28c]/50 shadow-[0_0_6px_rgba(111,162,140,0.5)]': isSteampunk,
                      }
                    )}
                  />
                </h4>
                <ul className="space-y-3 md:space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className={cn(
                          'relative inline-block text-sm transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:transition-all hover:after:w-full',
                          {
                            'text-neutral-400 after:bg-teal-400/80 after:shadow-[0_0_6px_rgba(57,179,155,0.8)] hover:text-white': !isSteampunk,
                            'text-[#8a9488] after:bg-[#6fa28c] after:shadow-[0_0_6px_rgba(111,162,140,0.8)] hover:text-[#d4cfc0]': isSteampunk,
                          }
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
              <span
                className={cn('h-1 w-1 rounded-full', {
                  'bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]': !isSteampunk,
                  'bg-[#6fa28c]/60 shadow-[0_0_4px_rgba(111,162,140,0.6)]': isSteampunk,
                })}
              />
              <span
                className={cn('h-px flex-1 bg-linear-to-r', {
                  'from-teal-400/40 via-white/10 to-transparent': !isSteampunk,
                  'from-[#6fa28c]/40 via-[#4a5c52]/30 to-transparent': isSteampunk,
                })}
              />
              <span
                className={cn('h-1 w-1 rounded-full', {
                  'bg-teal-400/60 shadow-[0_0_4px_rgba(57,179,155,0.6)]': !isSteampunk,
                  'bg-[#6fa28c]/60 shadow-[0_0_4px_rgba(111,162,140,0.6)]': isSteampunk,
                })}
              />
            </div>

            <p
              className={cn('w-full text-center leading-relaxed sm:text-left', {
                'text-neutral-500': !isSteampunk,
                'text-[#4a5c52]': isSteampunk,
              })}
            >
              {t('footer.copyright', { year: CURRENT_YEAR })}
            </p>

            <InfoBadge
              text={t('footer.badge')}
              className={cn({
                'border-[#4a5c52]/50 bg-[#0a0e0d] text-[#8a9488] shadow-none':
                isSteampunk,
              })}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};