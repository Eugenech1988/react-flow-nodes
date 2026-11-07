'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { MapPin, Clock, ArrowUpRight, Gauge, Power, ChevronDown } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { JOBS, DEPARTMENTS, type Department } from '../constants';
import { SectionHeading } from '@/shared/ui';

export function CareersConsole() {
  const { t } = useT('careers');
  const [activeDept, setActiveDept] = useState<Department>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const filtered = activeDept === 'all' ? JOBS : JOBS.filter((j) => j.dept === activeDept);

  const checkScrollHint = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 2;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    setShowScrollHint(hasOverflow && !atBottom);
  }, []);

  useEffect(() => {
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
  }, [checkScrollHint, activeDept]);

  const scrollMore = () => scrollRef.current?.scrollBy({ top: 220, behavior: 'smooth' });

  return (
    <section className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(111,162,140,0.22),transparent_65%)] blur-2xl" />
        <div className="pointer-events-none absolute inset-x-8 -top-4 -z-10 h-32 bg-[radial-gradient(ellipse_at_center,rgba(156,196,176,0.15),transparent_70%)] blur-xl" />

        <SectionHeading
          title={t('openings.heading.title')}
          description={t('openings.heading.description')}
          isMain={false}
          className='mb-20'
          gradientColors="from-[#9cc4b0] via-[#6fa28c] to-[#4a6d5e]"
          titleColor="text-[#d4cfc0]"
          descriptionColor="text-[#8a9488]"
        />

        <div className="relative overflow-hidden rounded-2xl border-2 border-[#4a5c52] bg-linear-to-b from-[#1a2420] to-[#0f1512] p-3 shadow-[inset_0_1px_0_rgba(156,196,176,0.15),0_20px_50px_rgba(0,0,0,0.8)] sm:rounded-3xl sm:p-4">
          {(['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'] as const).map(
            (pos) => (
              <span
                key={pos}
                className={`absolute ${pos} z-20 h-2 w-2 rounded-full bg-[#3a4842] shadow-[inset_0_1px_1px_rgba(156,196,176,0.25),inset_0_-1px_1px_rgba(0,0,0,0.8)]`}
              />
            ),
          )}

          <div className="mb-3 flex flex-wrap gap-1.5 sm:gap-2">
            {DEPARTMENTS.map((dept) => {
              const isActive = dept.id === activeDept;
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDept(dept.id)}
                  className={`group relative flex min-w-0 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md border px-3 py-2 font-mono text-[9px] font-bold tracking-widest uppercase transition-all sm:text-[10px] ${
                    isActive
                      ? 'border-[#9cc4b0] bg-linear-to-b from-[#4a7a68] to-[#2f5a4a] text-[#e8f4ee] shadow-[inset_0_1px_0_rgba(156,196,176,0.4),0_0_15px_rgba(111,162,140,0.4)]'
                      : 'border-[#3a4842] bg-linear-to-b from-[#232e28] to-[#141a16] text-[#8a9488] shadow-[inset_0_1px_0_rgba(156,196,176,0.08),inset_0_-1px_2px_rgba(0,0,0,0.5)] hover:border-[#6fa28c]/50 hover:text-[#9cc4b0]'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-1 w-1 rounded-full ${isActive ? 'bg-[#d4cfc0]/40' : 'bg-[#4a5c52]'}`} />
                  <span className={`absolute right-0.5 bottom-0.5 h-1 w-1 rounded-full ${isActive ? 'bg-[#d4cfc0]/40' : 'bg-[#4a5c52]'}`} />
                  <span className="relative z-10">{t(`openings.filters.${dept.id}`)}</span>
                  {isActive && (
                    <span className="absolute top-1/2 right-1.5 h-1 w-1 -translate-y-1/2 animate-pulse rounded-full bg-[#9cc4b0] shadow-[0_0_5px_#9cc4b0]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative flex h-90 flex-col overflow-hidden rounded-xl border border-[#2f3d36] bg-[#0a0e0d] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),inset_0_0_8px_rgba(111,162,140,0.1)] sm:h-120">
            <div className="pointer-events-none absolute inset-0 z-20 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,rgba(111,162,140,0.03)_2px,rgba(111,162,140,0.03)_3px)]" />
            <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />

            <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-[#2f3d36] bg-[#0f1512]/80 px-4 py-2 font-mono text-[10px] tracking-widest text-[#6fa28c] uppercase">
              <div className="flex items-center gap-2">
                <Power className="h-3 w-3" />
                <span>SYS.OPENINGS // {t(`openings.filters.${activeDept}`)}</span>
              </div>
              <div className="flex items-center gap-2 text-[#8a9488]">
                <Gauge className="h-3 w-3" />
                <span>{String(filtered.length).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              <div
                ref={scrollRef}
                className="h-full overflow-y-auto scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#4a6d5e]/70"
              >
                <m.div layout className="relative z-10 flex flex-col">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((job, idx) => {
                      const Icon = job.icon;
                      return (
                        <m.div
                          key={job.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.25, delay: idx * 0.03 }}
                          className="group relative flex flex-col gap-3 border-b border-dashed border-[#2f3d36] px-4 py-4 transition-colors hover:bg-[#6fa28c]/5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6"
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
                                {t(`openings.list.${job.id}.title`)}
                              </h3>
                              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] tracking-widest text-[#8a9488] uppercase sm:text-[10px]">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-2.5 w-2.5" />
                                  {t(`openings.list.${job.id}.location`)}
                                </span>
                                <span className="text-[#4a5c52]">·</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" />
                                  {t(`openings.list.${job.id}.type`)}
                                </span>
                                <span className="text-[#4a5c52]">·</span>
                                <span className="text-[#6fa28c]">
                                  {t(`openings.list.${job.id}.level`)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="relative flex cursor-pointer items-center gap-2 self-start rounded border border-[#3a4842] bg-[#0f1512] px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest text-[#9cc4b0] uppercase transition-all hover:border-[#6fa28c] hover:bg-[#6fa28c]/10 sm:self-center sm:text-[10px]"
                          >
                            {t('openings.apply')}
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        </m.div>
                      );
                    })}
                  </AnimatePresence>
                </m.div>
              </div>

              <AnimatePresence>
                {showScrollHint && (
                  <m.button
                    type="button"
                    onClick={scrollMore}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    aria-label="Scroll for more"
                    className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border border-[#4a6d5e] bg-[#0f1512]/95 px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest text-[#9cc4b0] uppercase shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(156,196,176,0.15)] backdrop-blur-sm hover:border-[#9cc4b0] hover:bg-[#141a16]"
                  >
                    <ChevronDown className="h-3 w-3 animate-bounce" />
                    More
                  </m.button>
                )}
              </AnimatePresence>
            </div>

            <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-[#2f3d36] bg-[#0f1512]/80 px-4 py-2 font-mono text-[10px] tracking-widest uppercase">
              <span className="flex items-center gap-2 text-[#8a9488]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6fa28c] shadow-[0_0_5px_#6fa28c]" />
                SYS.ONLINE
              </span>
              <span className="text-[#4a5c52]">v1.2.0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}