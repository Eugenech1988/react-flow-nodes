'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Clock,
  ChevronRight,
  Gauge,
  Power,
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
  type Department,
} from '../constants';
import { SectionHeading, MonitorFrame } from '@/shared/ui';

interface CareersConsoleProps {
  jobs: TPublicJob[];
  locale: string;
}

export const CareersConsole = ({ jobs, locale }: CareersConsoleProps) => {
  const [activeDept, setActiveDept] = useState<Department>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const { t } = useT('careers');
  const router = useRouter();

  const handleJobClick = (e: React.MouseEvent, job: TPublicJob) => {
    e.preventDefault();

    incrementJobViews(job.id, job.slug, locale).catch((err) => {
      console.error('Failed to increment views', err);
    });

    router.push(`/${locale}/careers/${job.slug}`);
  };

  const filtered =
    activeDept === 'all' ? jobs : jobs.filter((j) => j.department === DEPT_TO_BACKEND[activeDept]);

  useEffect(() => {
    const checkScrollHint = () => {
      const el = scrollRef.current;
      if (!el) return;
      const hasOverflow = el.scrollHeight > el.clientHeight + 2;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      setShowScrollHint(hasOverflow && !atBottom);
    };

    checkScrollHint();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(checkScrollHint);
    ro.observe(el);
    el.addEventListener('scroll', checkScrollHint, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', checkScrollHint);
    };
  }, [activeDept]);

  const scrollMore = () => scrollRef.current?.scrollBy({ top: 220, behavior: 'smooth' });

  return (
    <section id="openings" className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-4 sm:py-16">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(111,162,140,0.22),transparent_65%)] blur-2xl" />
        <div className="pointer-events-none absolute inset-x-8 -top-4 -z-10 h-32 bg-[radial-gradient(ellipse_at_center,rgba(156,196,176,0.15),transparent_70%)] blur-xl" />

        <SectionHeading
          title={t('openings.heading.title')}
          description={t('openings.heading.description')}
          isMain={false}
          className="mb-20"
          gradientColors="from-[#9cc4b0] via-[#6fa28c] to-[#4a6d5e]"
          titleColor="text-[#d4cfc0]"
          descriptionColor="text-[#8a9488]"
        />

        <MonitorFrame
          theme="careers"
          className="h-100 sm:h-130"
          headerIcon={Power}
          headerTitle={
            <div className="flex items-center gap-4">
              <span>SYS.OPENINGS // {t(`openings.filters.${activeDept}`)}</span>
              <span className="flex items-center gap-1.5 text-[#8a9488]">
                <Gauge className="h-3.5 w-3.5" />
                {String(filtered.length).padStart(2, '0')}
              </span>
            </div>
          }
          toolbar={
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {DEPARTMENTS.map((dept) => {
                const isActive = dept.id === activeDept;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setActiveDept(dept.id)}
                    className={`group relative flex min-w-0 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md border px-3 py-2 font-mono text-[9px] font-bold tracking-widest uppercase transition-all sm:text-[10px] ${
                      isActive
                        ? 'border-[#9cc4b0] bg-linear-to-b from-[#4a7a68] to-[#2f5a4a] text-[#e8f4ee] shadow-[inset_0_1px_0_rgba(156,196,176,0.4),0_0_15px_rgba(111,162,140,0.4)]'
                        : 'border-[#3a4842] bg-linear-to-b from-[#232e28] to-[#141a16] text-[#8a9488] shadow-[inset_0_1px_0_rgba(156,196,176,0.08),inset_0_-1px_2px_rgba(0,0,0,0.5)] hover:border-[#6fa28c]/50 hover:text-[#9cc4b0]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-1 w-1 rounded-full ${isActive ? 'bg-[#d4cfc0]/40' : 'bg-[#4a5c52]'}`}
                    />
                    <span
                      className={`absolute right-0.5 bottom-0.5 h-1 w-1 rounded-full ${isActive ? 'bg-[#d4cfc0]/40' : 'bg-[#4a5c52]'}`}
                    />
                    <span className="relative z-10">{t(`openings.filters.${dept.id}`)}</span>
                    {isActive && (
                      <span className="absolute top-1/2 right-1.5 h-1 w-1 -translate-y-1/2 animate-pulse rounded-full bg-[#9cc4b0] shadow-[0_0_5px_#9cc4b0]" />
                    )}
                  </button>
                );
              })}
            </div>
          }
          footer={
            <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest uppercase">
              <span className="flex items-center gap-2 text-[#8a9488]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6fa28c] shadow-[0_0_5px_#6fa28c]" />
                SYS.ONLINE
              </span>
              <span className="text-[#4a5c52]">v1.2.0</span>
            </div>
          }
        >
          <div className="relative flex h-full flex-col overflow-hidden">
            <div
              ref={scrollRef}
              className="h-full scrollbar-thin overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#4a6d5e]/70"
            >
              {filtered.length === 0 ? (
                <div className="flex h-full items-center justify-center px-6 py-12 text-center font-mono text-xs tracking-widest text-[#8a9488] uppercase">
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
                        className="group animate-in fade-in slide-in-from-left-4 relative flex flex-col gap-3 border-b border-dashed border-[#2f3d36] px-4 py-4 transition-colors duration-300 ease-out hover:bg-[#6fa28c]/5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6"
                        style={{ animationDelay: `${idx * 30}ms`, animationFillMode: 'both' }}
                      >
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-[#6fa28c]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="relative flex items-start gap-3 sm:gap-4">
                          <div className="flex flex-col items-center">
                            <span className="font-mono text-[9px] tracking-widest text-[#4a5c52] uppercase">
                              {String(idx + 1).padStart(3, '0')}
                            </span>
                            <Icon className="mt-1 h-5 w-5 text-[#6fa28c]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[#d4cfc0] transition-colors group-hover:text-[#9cc4b0] sm:text-base">
                              {job.title}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] tracking-widest text-[#8a9488] uppercase sm:text-[10px]">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" />
                                {job.location}
                              </span>
                              <span className="text-[#4a5c52]">·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {typeLabel}
                              </span>
                              <span className="text-[#4a5c52]">·</span>
                              <span className="text-[#6fa28c]">{levelLabel}</span>
                              <span className="text-[#4a5c52]">·</span>
                              <span className="flex items-center gap-1" title="Views">
                                <Eye className="h-2.5 w-2.5" />
                                {job.views ?? 0}
                              </span>
                              <span className="text-[#4a5c52]">·</span>
                              <span className="flex items-center gap-1" title="Applications">
                                <FileText className="h-2.5 w-2.5" />
                                {job.applications ?? 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="relative flex cursor-pointer items-center gap-2 self-start rounded border border-[#3a4842] bg-[#0f1512] px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest text-[#9cc4b0] uppercase transition-all group-hover:border-[#6fa28c] group-hover:bg-[#6fa28c]/10 sm:self-center sm:text-[10px]">
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
                className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border border-[#4a6d5e] bg-[#0f1512]/95 px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest text-[#9cc4b0] uppercase shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(156,196,176,0.15)] backdrop-blur-sm duration-200 hover:border-[#9cc4b0] hover:bg-[#141a16]"
              >
                <ChevronDown className="h-3 w-3 animate-bounce" />
                More
              </button>
            )}
          </div>
        </MonitorFrame>
      </div>
    </section>
  );
};
