'use client';

import { Section, SectionDecorator, SectionHeading, TechCard } from '@/shared/ui';
import { COMPANIES } from './constants';
import { useT } from '@/shared/lib/i18n/client';
import { Activity, Disc, Gauge } from 'lucide-react';

export function TrustedBySection() {
  const { t } = useT('marketing');
  const duplicatedCompanies = [...COMPANIES, ...COMPANIES];

  return (
    <Section className="bg-slate-950 py-24 text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(4,47,46,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,47,46,0.4)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[4rem_4rem]" />

      <SectionDecorator icon={Gauge} position="top-left" opacity={0.03} />
      <SectionDecorator icon={Activity} position="bottom-right" opacity={0.03} />
      <Disc className="pointer-events-none absolute bottom-10 left-1/4 h-32 w-32 text-[#2dd4bf]/2" />

      <div className="pointer-events-none absolute bottom-0 left-10 h-64 w-64 animate-[float-blob_6s_ease-in-out_infinite] rounded-full bg-[#2dd4bf]/20 blur-[80px] motion-reduce:animate-none" />
      <div className="pointer-events-none absolute top-1/4 right-10 h-72 w-72 animate-[float-blob-delayed_8s_ease-in-out_infinite_2s] rounded-full bg-[#2dd4bf]/10 blur-[100px] motion-reduce:animate-none" />

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
            <div className="absolute inset-y-0 z-10 w-48 animate-[sweep_4s_linear_infinite] bg-linear-to-r from-transparent via-[#5eead4]/20 to-transparent motion-reduce:hidden" />
          </div>

          <div className="group relative z-20 flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] py-4">
            <div className="group-hover:paused flex w-max animate-[marquee_30s_linear_infinite] items-center gap-12 px-6 motion-reduce:animate-none">
              {duplicatedCompanies.map((company, index) => {
                const Icon = company.icon;
                return (
                  <TechCard
                    key={`${company.name}-${index}`}
                    className="flex shrink-0 items-center gap-4 rounded-xl px-8 py-4 transition-[colors,box-shadow] duration-300 hover:border-[#2dd4bf]/50 hover:bg-slate-800/90 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)]"
                  >
                    <Icon className="h-6 w-6 text-[#2dd4bf] drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-mono text-sm font-bold tracking-widest text-slate-200 uppercase transition-colors group-hover:text-white">
                      {company.name}
                    </span>
                  </TechCard>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
