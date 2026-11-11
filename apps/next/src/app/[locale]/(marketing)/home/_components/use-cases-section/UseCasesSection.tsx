'use client';

import { Lock, Network, Factory, Activity } from 'lucide-react';
import {
  Section,
  SectionDecorator,
  TechCard,
  Reveal,
  Badge,
  SectionHeading,
} from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { USE_CASES } from './constants';

export const UseCasesSection = () => {
  const { t } = useT('marketing');

  return (
    <Section id="use-cases" className="bg-slate-950 text-slate-100">
      <SectionDecorator icon={Network} position="top-left" opacity={0.05} />
      <SectionDecorator icon={Factory} position="bottom-right" opacity={0.05} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          title={t('useCases.heading.title')}
          description={t('useCases.heading.description')}
          isMain={false}
        />

        <div className="relative mt-12 sm:mt-16 lg:mt-20">
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-1 -translate-x-1/2 border-x border-slate-800 bg-slate-900 lg:block" />

          <div
            className="relative z-10 grid grid-cols-1 items-start gap-5 sm:gap-6 md:grid-cols-2 lg:gap-12"
            style={{ perspective: 1200 }}
          >
            {USE_CASES.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal key={item.id} delay={index * 150} animation="zoom">
                  <TechCard className={`p-5 sm:p-8 ${item.rotation} ${item.offset}`}>
                    <Icon className="pointer-events-none absolute -right-6 -bottom-6 h-40 w-40 text-slate-700/20 transition-all duration-500 group-hover:scale-110 group-hover:text-[#2dd4bf]/10 sm:-right-8 sm:-bottom-8 sm:h-56 sm:w-56" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.05),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative z-10 mb-5 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2dd4bf]/20 bg-slate-950 text-[#2dd4bf] shadow-[inset_0_0_15px_rgba(45,212,191,0.1)] sm:h-12 sm:w-12">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-[9px] tracking-widest text-[#c9a55c]/70 uppercase sm:text-[10px]">
                            MODULE // {item.id}
                          </span>
                          <div className="mt-1 flex items-center gap-2">
                            <Lock className="h-3 w-3 text-slate-600" />
                            <span className="font-mono text-[10px] font-bold tracking-widest text-[#2dd4bf]/70 sm:text-xs">
                              {t('useCases.secure')}
                            </span>
                          </div>
                        </div>
                      </div>
                      + <Badge variant="hex" className="text-[10px] sm:text-xs">
                        {t(`useCases.list.${item.id}.category`)}
                      </Badge>
                    </div>

                    <div className="relative z-10 mb-6 sm:mb-8">
                      <h3 className="mb-2 text-lg font-bold text-slate-100 transition-colors duration-300 group-hover:text-white sm:mb-3 sm:text-xl">
                        {t(`useCases.list.${item.id}.title`)}
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
                        {t(`useCases.list.${item.id}.description`)}
                      </p>
                    </div>

                    <div className="relative z-10 mt-auto flex items-center justify-between border-t border-slate-800/80 pt-4 sm:pt-5">
                      <div className="flex items-center gap-2 rounded border border-[#2dd4bf]/20 bg-slate-950 px-2 py-1 font-mono text-[10px] text-[#2dd4bf]/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] sm:px-3 sm:py-1.5 sm:text-xs">
                        <Activity className="h-3 w-3 animate-pulse text-[#2dd4bf] sm:h-3.5 sm:w-3.5" />
                        {t(`useCases.list.${item.id}.metric`)}
                      </div>
                    </div>
                  </TechCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
};
