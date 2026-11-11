'use client';

import { Section, SectionDecorator, SectionHeading, TechCard } from '@/shared/ui';
import { COMPANIES } from './constants';
import { useT } from '@/shared/lib/i18n/client';
import { Activity, Disc, Gauge } from 'lucide-react';

export const TrustedBySection = () => {
  const { t } = useT('marketing');
  const duplicatedCompanies = [...COMPANIES, ...COMPANIES];

  return (
    <Section className="bg-slate-950 py-16 text-slate-100 sm:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,41,59,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.4)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[4rem_4rem]" />

      <SectionDecorator icon={Gauge} position="top-left" opacity={0.03} />
      <SectionDecorator icon={Activity} position="bottom-right" opacity={0.03} />
      <Disc className="pointer-events-none absolute bottom-10 left-1/4 h-24 w-24 text-[#2dd4bf]/5 sm:h-32 sm:w-32" />

      <div className="pointer-events-none absolute bottom-0 left-10 h-48 w-48 animate-[float-blob_6s_ease-in-out_infinite] rounded-full bg-[#2dd4bf]/20 blur-[80px] motion-reduce:animate-none sm:h-64 sm:w-64" />
      <div className="pointer-events-none absolute top-1/4 right-10 h-56 w-56 animate-[float-blob-delayed_8s_ease-in-out_infinite_2s] rounded-full bg-[#2dd4bf]/10 blur-[100px] motion-reduce:animate-none sm:h-72 sm:w-72" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title={t('trustedBy.heading.title')}
          description={t('trustedBy.heading.description')}
          isMain={false}
        />

        <div className="relative mt-12 w-full sm:mt-16">
          <div className="absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 overflow-hidden rounded-full border-y border-slate-800 bg-slate-900/80 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] shadow-[inset_0_4px_20px_rgba(0,0,0,0.9),0_4px_10px_rgba(0,0,0,0.5)] backdrop-blur-sm sm:h-20">
            <div className="absolute inset-0 flex justify-between px-4 opacity-40 sm:px-12">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-full w-2 border-x border-slate-700 bg-slate-900 sm:w-3" />
              ))}
            </div>
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[#2dd4bf]/40 shadow-[0_0_15px_#2dd4bf]" />
            <div className="absolute inset-y-0 z-10 w-32 animate-[sweep_4s_linear_infinite] bg-linear-to-r from-transparent via-[#5eead4]/20 to-transparent motion-reduce:hidden sm:w-48" />
          </div>

          <div className="relative z-20 flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] py-4">
            <div className="flex w-max animate-[marquee_30s_linear_infinite] items-center gap-4 px-4 hover:[animation-play-state:paused] motion-reduce:animate-none sm:gap-12 sm:px-6">
              {duplicatedCompanies.map((company, index) => {
                const Icon = company.icon;
                return (
                  <TechCard
                    key={`${company.name}-${index}`}
                    className="group flex shrink-0 flex-row items-center gap-3 rounded-xl px-5 py-3 transition-all duration-300 hover:translate-y-0 hover:border-[#2dd4bf]/50 hover:bg-slate-800/90 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)] sm:gap-4 sm:px-8 sm:py-4"
                  >
                    <Icon className="h-5 w-5 text-[#2dd4bf] drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6" />
                    <span className="font-mono text-xs font-bold tracking-widest text-slate-200 uppercase transition-colors group-hover:text-white sm:text-sm">
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
};
