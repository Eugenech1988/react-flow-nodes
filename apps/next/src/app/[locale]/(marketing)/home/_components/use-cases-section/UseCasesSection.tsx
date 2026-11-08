'use client';

import { Lock, Network, Factory, Activity } from 'lucide-react';
import {
  Section,
  SectionDecorator,
  TechCard,
  Reveal,
  CutoutBadge,
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

      <div className="pointer-events-none absolute top-40 bottom-20 left-1/2 hidden w-1 -translate-x-1/2 border-x border-slate-800 bg-slate-900 lg:block" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          title={t('useCases.heading.title')}
          description={t('useCases.heading.description')}
          isMain={false}
        />

        <div
          className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12"
          style={{ perspective: 1200 }}
        >
          {USE_CASES.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.id} delay={index * 150} animation="zoom">
                <TechCard
                  className={`h-full justify-between p-6 sm:p-8 ${item.rotation} ${item.offset}`}
                >
                  <Icon className="pointer-events-none absolute -right-8 -bottom-8 h-56 w-56 text-slate-700/20 transition-all duration-500 group-hover:scale-110 group-hover:text-[#2dd4bf]/10" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.05),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10 mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#2dd4bf]/20 bg-slate-950 text-[#2dd4bf] shadow-[inset_0_0_15px_rgba(45,212,191,0.1)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] tracking-widest text-[#c9a55c]/70 uppercase">
                          MODULE // {item.id}
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          <Lock className="h-3 w-3 text-slate-600" />
                          <span className="font-mono text-xs font-bold tracking-widest text-[#2dd4bf]/70">
                            {t('useCases.secure')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CutoutBadge>{t(`useCases.list.${item.id}.category`)}</CutoutBadge>
                  </div>

                  <div className="relative z-10 mb-8">
                    <h3 className="mb-3 text-xl font-bold text-slate-100 transition-colors duration-300 group-hover:text-white">
                      {t(`useCases.list.${item.id}.title`)}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {t(`useCases.list.${item.id}.description`)}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto flex items-center justify-between border-t border-slate-800/80 pt-5">
                    <div className="flex items-center gap-2 rounded border border-[#2dd4bf]/20 bg-slate-950 px-3 py-1.5 font-mono text-xs text-[#2dd4bf]/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                      <Activity className="h-3.5 w-3.5 animate-pulse text-[#2dd4bf]" />
                      {t(`useCases.list.${item.id}.metric`)}
                    </div>
                  </div>
                </TechCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
