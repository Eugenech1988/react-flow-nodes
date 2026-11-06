'use client';

import { useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '@/shared/ui';
import { COMPANIES } from '@/widgets/sections/trusted-by-section/model';
import { useT } from '@/shared/lib/i18n/client';
import { Activity, Disc, Gauge } from 'lucide-react';

export function TrustedBySection() {
  const { t } = useT('marketing');
  const prefersReducedMotion = useReducedMotion();
  const duplicatedCompanies = [...COMPANIES, ...COMPANIES];

  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useAnimationFrame((t, delta) => {
    if (prefersReducedMotion || isHovered) return;

    const moveBy = -0.06 * delta;
    let currentX = x.get() + moveBy;

    if (trackRef.current) {
      const halfWidth = trackRef.current.scrollWidth / 2;

      if (Math.abs(currentX) >= halfWidth) {
        currentX = 0;
      }
    }
    x.set(currentX);
  });

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(4,47,46,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,47,46,0.4)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[4rem_4rem]" />

      <div className="pointer-events-none absolute top-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />

      <Gauge className="pointer-events-none absolute top-12 -left-16 h-72 w-72 text-[#2dd4bf]/3" />
      <Activity className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 text-[#2dd4bf]/3" />
      <Disc className="pointer-events-none absolute bottom-10 left-1/4 h-32 w-32 text-[#2dd4bf]/2" />

      {!prefersReducedMotion && (
        <>
          <motion.div
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="pointer-events-none absolute bottom-0 left-10 h-64 w-64 rounded-full bg-[#2dd4bf]/20 blur-[80px]"
          />
          <motion.div
            animate={{ y: [0, -40, 0], opacity: [0.1, 0.2, 0.1], scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 2 }}
            className="pointer-events-none absolute top-1/4 right-10 h-72 w-72 rounded-full bg-[#2dd4bf]/10 blur-[100px]"
          />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          title={t('trustedBy.heading.title')}
          description={t('trustedBy.heading.description')}
          isMain={false}
        />

        <div className="relative mt-16 w-full">
          <div className="absolute inset-x-0 top-1/2 h-20 -translate-y-1/2 overflow-hidden rounded-full border-y border-slate-800 bg-slate-900/80 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] shadow-[inset_0_4px_20px_rgba(0,0,0,0.9),0_4px_10px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            <div className="absolute inset-0 flex justify-between px-12 opacity-40">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-full w-3 border-x border-slate-700 bg-slate-900" />
              ))}
            </div>

            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[#2dd4bf]/40 shadow-[0_0_15px_#2dd4bf]" />

            {!prefersReducedMotion && (
              <motion.div
                animate={{ left: ['-20%', '120%'] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="absolute inset-y-0 z-10 w-48 bg-linear-to-r from-transparent via-[#5eead4]/20 to-transparent"
              />
            )}
          </div>

          <div
            className="relative z-20 flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] py-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex w-max items-center gap-12 px-6"
            >
              {duplicatedCompanies.map((company, index) => {
                const Icon = company.icon;
                return (
                  <div
                    key={`${company.name}-${index}`}
                    className="group relative flex shrink-0 items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/90 px-8 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md transition-[colors,box-shadow] duration-300 hover:border-[#2dd4bf]/50 hover:bg-slate-800/90 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]"
                  >
                    <span className="absolute top-2 left-2 h-1 w-1 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_0_1px_rgba(0,0,0,0.8)]" />
                    <span className="absolute top-2 right-2 h-1 w-1 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_0_1px_rgba(0,0,0,0.8)]" />
                    <span className="absolute bottom-2 left-2 h-1 w-1 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_0_1px_rgba(0,0,0,0.8)]" />
                    <span className="absolute right-2 bottom-2 h-1 w-1 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_0_1px_rgba(0,0,0,0.8)]" />

                    <Icon className="h-6 w-6 text-[#2dd4bf] drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-mono text-sm font-bold tracking-widest text-slate-200 uppercase transition-colors group-hover:text-white">
                      {company.name}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}