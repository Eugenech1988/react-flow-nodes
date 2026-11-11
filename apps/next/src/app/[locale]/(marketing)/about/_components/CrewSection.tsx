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
            <div className="group relative h-full overflow-hidden rounded-2xl border border-[#2dd4bf]/15 bg-[#0b1715]/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#2dd4bf]/40 hover:bg-[#0b1715]/80 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 h-0.5 w-full bg-[#2dd4bf]/20">
                <div className="h-full w-1/3 bg-[#2dd4bf] shadow-[0_0_10px_#2dd4bf] transition-all duration-500 group-hover:w-full" />
              </div>

              <div className="flex items-start justify-between">
                <span className="font-mono text-[9px] tracking-widest text-[#2dd4bf]/50">
                  ID: 00{member.id}-A
                </span>
                <Fingerprint className="h-4 w-4 text-[#2dd4bf]/30 transition-colors group-hover:text-[#2dd4bf]" />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-xl border border-[#2dd4bf]/30 bg-[#040a09] p-1 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] transition-colors group-hover:border-[#2dd4bf]">
                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <Image
                      src={member.avatar}
                      alt={t(`crew.list.${member.id}.name`)}
                      fill
                      sizes="64px"
                      className="object-cover grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-[#2dd4bf]/10 mix-blend-overlay transition-opacity group-hover:opacity-0" />
                  </div>
                  <span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#0b1715] bg-[#2dd4bf]">
                    <ScanLine className="h-2 w-2 text-[#0b1715]" />
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-[#d1faf5] transition-colors group-hover:text-white">
                    {t(`crew.list.${member.id}.name`)}
                  </h3>
                  <p className="mt-1 truncate font-mono text-[10px] tracking-widest text-[#2dd4bf]/60 uppercase">
                    {t(`crew.list.${member.id}.role`)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-[#2dd4bf]/10 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[8px] text-slate-500 uppercase">Status</span>
                  <span className="flex items-center gap-1.5 font-mono text-[9px] text-[#2dd4bf] uppercase">
                    <CircleDot className="h-3 w-3 animate-pulse" /> Active
                  </span>
                </div>

                <div className="flex h-6 items-end gap-0.5 opacity-40 transition-opacity group-hover:opacity-100">
                  {BARCODE.map((w, i) => (
                    <div
                      key={i}
                      className="bg-[#2dd4bf]"
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
