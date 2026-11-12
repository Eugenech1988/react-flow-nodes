'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Clock,
  ChevronRight,
  // Gauge,
  // Power,
  ChevronDown,
  Eye,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { useT } from '@/shared/lib/i18n/client';
import type { TPublicJob } from '@/shared/api';
import { incrementJobViews } from '@/shared/api';
import {
  DEPARTMENTS,
  DEPT_TO_BACKEND,
  LEVEL_LABELS,
  TYPE_LABELS,
  resolveJobIcon,
  type TDepartment,
} from '../constants';
import { SectionHeading, Frame } from '@/shared/ui';
import { useScrollHint } from '@/shared/hooks';

interface ICareersConsoleProps {
  jobs: TPublicJob[];
  locale: string;
}

export const CareersConsole = ({ jobs, locale }: ICareersConsoleProps) => {
  const [activeDept, setActiveDept] = useState<TDepartment>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useT('careers');
  const router = useRouter();

  const handleJobClick = (e: React.MouseEvent, job: TPublicJob) => {
    const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    if (isModified) return;

    e.preventDefault();

    incrementJobViews(job.id, job.slug, locale).catch((err) => {
      console.error('Failed to increment views', err);
    });

    router.push(`/${locale}/careers/${job.slug}`);
  };

  const filtered =
    activeDept === 'all' ? jobs : jobs.filter((j) => j.department === DEPT_TO_BACKEND[activeDept]);

  const showScrollHint = useScrollHint(scrollRef);

  const scrollMore = () => scrollRef.current?.scrollBy({ top: 220, behavior: 'smooth' });

  return (
    <section id="openings" className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-4 sm:py-16">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--theme-accent)_22%,transparent),transparent_65%)] blur-2xl" />
        <div className="pointer-events-none absolute inset-x-8 -top-4 -z-10 h-32 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--theme-accent-hover)_15%,transparent),transparent_70%)] blur-xl" />

        <SectionHeading
          title={t('openings.heading.title')}
          description={t('openings.heading.description')}
          isMain={false}
          className="mb-20"
          gradientColors="from-theme-accent-hover via-theme-accent to-theme-accent-deep"
          titleColor="text-theme-fg"
          descriptionColor="text-theme-muted"
        />

        <Frame
          theme="careers"
          className="h-100 sm:h-130"
          toolbar={
            <div className="flex w-full">
              {DEPARTMENTS.map((dept, idx) => {
                const isActive = dept.id === activeDept;
                const isFirst = idx === 0;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveDept(dept.id)}
                    className={`group border-theme-line relative flex flex-1 cursor-pointer items-center justify-center overflow-hidden border-y border-r px-3 py-2.5 font-mono text-[9px] font-bold tracking-widest uppercase transition-all sm:text-[10px] ${
                      isFirst ? 'border-l' : ''
                    } ${
                      isActive
                        ? 'border-theme-accent-hover from-theme-accent-deep to-theme-accent-deep/80 text-theme-bg bg-linear-to-b shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent-hover)_40%,transparent),0_0_15px_color-mix(in_oklab,var(--theme-accent)_40%,transparent)]'
                        : 'from-theme-surface to-theme-bg text-theme-muted hover:border-theme-accent/50 hover:text-theme-accent-hover bg-linear-to-b shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent-hover)_8%,transparent),inset_0_-1px_2px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    <span className="relative z-10">{t(`openings.filters.${dept.id}`)}</span>
                    {isActive && (
                      <span className="bg-theme-accent-hover absolute top-1/2 right-3 h-1 w-1 -translate-y-1/2 animate-pulse rounded-full shadow-[0_0_5px_var(--theme-accent-hover)]" />
                    )}
                  </button>
                );
              })}
            </div>
          }
        >
          <div className="relative flex h-full flex-col overflow-hidden">
            <div
              ref={scrollRef}
              className="[&::-webkit-scrollbar-thumb]:bg-theme-accent-deep/70 h-full scrollbar-thin overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              {filtered.length === 0 ? (
                <div className="text-theme-muted flex h-full items-center justify-center px-6 py-12 text-center font-mono text-xs tracking-widest uppercase">
                  {t('openings.empty', {
                    defaultValue: 'No open positions right now. Check back soon.',
                  })}
                </div>
              ) : (
                <div key={activeDept} className="relative z-10 flex flex-col">
                  {filtered.map((job, idx) => {
                    const Icon = resolveJobIcon(job.icon);
                    const typeLabel = t(`openings.types.${job.type}`, {
                      defaultValue: TYPE_LABELS[job.type] ?? job.type,
                    });
                    const levelLabel = t(`openings.levels.${job.level}`, {
                      defaultValue: LEVEL_LABELS[job.level] ?? job.level,
                    });

                    return (
                      <Link
                        key={job.id}
                        href={`/${locale}/careers/${job.slug}`}
                        onClick={(e) => handleJobClick(e, job)}
                        className="group animate-in fade-in slide-in-from-left-4 border-theme-line hover:bg-theme-accent/5 relative flex flex-col gap-3 border-b border-dashed px-4 py-4 transition-colors duration-300 ease-out sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6"
                        style={{ animationDelay: `${idx * 30}ms`, animationFillMode: 'both' }}
                      >
                        <div className="via-theme-accent/5 pointer-events-none absolute inset-0 bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="relative flex items-start gap-3 sm:gap-4">
                          <div className="flex flex-col items-center">
                            <span className="text-theme-dim font-mono text-[9px] tracking-widest uppercase">
                              {String(idx + 1).padStart(3, '0')}
                            </span>
                            <Icon className="text-theme-accent mt-1 h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-theme-fg group-hover:text-theme-accent-hover text-sm font-bold transition-colors sm:text-base">
                              {job.title}
                            </h3>
                            <div className="text-theme-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] tracking-widest uppercase sm:text-[10px]">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" />
                                {job.location}
                              </span>
                              <span className="text-theme-dim">·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {typeLabel}
                              </span>
                              <span className="text-theme-dim">·</span>
                              <span className="text-theme-accent">{levelLabel}</span>
                              <span className="text-theme-dim">·</span>
                              <span className="flex items-center gap-1" title="Views">
                                <Eye className="h-2.5 w-2.5" />
                                {job.views ?? 0}
                              </span>
                              <span className="text-theme-dim">·</span>
                              <span className="flex items-center gap-1" title="Applications">
                                <FileText className="h-2.5 w-2.5" />
                                {job.applications ?? 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="border-theme-line bg-theme-bg text-theme-accent-hover group-hover:border-theme-accent group-hover:bg-theme-accent/10 relative flex cursor-pointer items-center gap-2 self-start rounded border px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest uppercase transition-all sm:self-center sm:text-[10px]">
                          {t('openings.apply')}
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {showScrollHint && (
              <button
                type="button"
                onClick={scrollMore}
                aria-label="Scroll for more"
                className="animate-in fade-in slide-in-from-bottom-2 border-theme-accent-deep bg-theme-surface/95 text-theme-accent-hover hover:border-theme-accent-hover hover:bg-theme-surface absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest uppercase shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_color-mix(in_oklab,var(--theme-accent-hover)_15%,transparent)] backdrop-blur-sm duration-200"
              >
                <ChevronDown className="h-3 w-3 animate-bounce" />
                More
              </button>
            )}
          </div>
        </Frame>
      </div>
    </section>
  );
};
