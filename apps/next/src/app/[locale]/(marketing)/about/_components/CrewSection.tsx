'use client';

import Image from 'next/image';
import { CircleDot, Fingerprint, ScanLine } from 'lucide-react';
import { SectionHeading, Reveal } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { CREW } from './constants';

const BARCODE = [3, 1, 2, 4, 1, 3, 2, 1, 4];

export const CrewSection = () => {
  const { t } = useT('about');

  return (
    <section className="mb-18 md:mb-20">
      <SectionHeading title={t('crew.title')} description={t('crew.description')} isMain={false} />

      <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {CREW.map((member, index) => (
          <Reveal key={member.id} delay={(index % 3) * 100}>
            <div className="group border-theme-accent/15 bg-theme-surface/40 hover:border-theme-accent/40 hover:bg-theme-surface/80 relative h-full overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="bg-theme-accent/20 absolute top-0 left-0 h-0.5 w-full">
                <div className="bg-theme-accent h-full w-1/3 shadow-[0_0_10px_var(--theme-accent)] transition-all duration-500 group-hover:w-full" />
              </div>

              <div className="flex items-start justify-between">
                <span className="text-theme-accent/50 font-mono text-[9px] tracking-widest">
                  ID: 00{member.id}-A
                </span>
                <Fingerprint className="text-theme-accent/30 group-hover:text-theme-accent h-4 w-4 transition-colors" />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="border-theme-accent/30 bg-theme-bg group-hover:border-theme-accent relative h-16 w-16 shrink-0 rounded-xl border p-1 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] transition-colors">
                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <Image
                      src={member.avatar}
                      alt={t(`crew.list.${member.id}.name`)}
                      fill
                      sizes="64px"
                      className="object-cover grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                    />
                    <div className="bg-theme-accent/10 absolute inset-0 mix-blend-overlay transition-opacity group-hover:opacity-0" />
                  </div>
                  <span className="border-theme-surface bg-theme-accent absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border">
                    <ScanLine className="text-theme-bg h-2 w-2" />
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-theme-fg truncate text-base font-bold transition-colors group-hover:text-white">
                    {t(`crew.list.${member.id}.name`)}
                  </h3>
                  <p className="text-theme-accent/60 mt-1 truncate font-mono text-[10px] tracking-widest uppercase">
                    {t(`crew.list.${member.id}.role`)}
                  </p>
                </div>
              </div>

              <div className="border-theme-accent/10 mt-6 flex items-end justify-between border-t pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-theme-dim font-mono text-[8px] uppercase">Status</span>
                  <span className="text-theme-accent flex items-center gap-1.5 font-mono text-[9px] uppercase">
                    <CircleDot className="h-3 w-3 animate-pulse" /> Active
                  </span>
                </div>

                <div className="flex h-6 items-end gap-0.5 opacity-40 transition-opacity group-hover:opacity-100">
                  {BARCODE.map((w, i) => (
                    <div
                      key={i}
                      className="bg-theme-accent"
                      style={{ width: `${w}px`, height: '100%' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
