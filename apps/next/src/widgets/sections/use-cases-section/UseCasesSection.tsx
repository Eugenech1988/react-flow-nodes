'use client';

import { motion } from 'framer-motion';
import { Lock, Network, Factory, Activity } from 'lucide-react';
import { SectionHeading, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import {
  UC_CARD_VARIANTS,
  UC_CONTAINER_VARIANTS,
  USE_CASES,
} from '@/widgets/sections/use-cases-section/model';

export const UseCasesSection = () => {
  const { t } = useT('marketing');

  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950 py-24 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#2dd4bf_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.03]" />

      <Network className="pointer-events-none absolute top-20 -left-20 h-96 w-96 text-slate-800/20" />
      <Factory className="pointer-events-none absolute -right-16 bottom-20 h-80 w-80 text-slate-800/20" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-150 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2dd4bf]/3 blur-3xl" />

      <div className="pointer-events-none absolute top-40 bottom-20 left-1/2 hidden w-1 -translate-x-1/2 border-x border-slate-800 bg-slate-900 lg:block" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          title={t('useCases.heading.title')}
          description={t('useCases.heading.description')}
          isMain={false}
        />

        <motion.div
          variants={UC_CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12"
          style={{ perspective: 1200 }}
        >
          {USE_CASES.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                custom={{ rot: item.rotation }}
                variants={UC_CARD_VARIANTS}
                whileHover={{ rotate: 0, y: -8, transition: { duration: 0.2 } }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:border-[#2dd4bf]/50 hover:bg-slate-800/90 hover:shadow-[0_15px_40px_rgba(45,212,191,0.15)] sm:p-8 ${item.rotation} ${item.offset}`}
              >
                <span className="absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                <span className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
                <span className="absolute right-2 bottom-2 h-1.5 w-1.5 rounded-full bg-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />

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

                  <div className="relative shrink-0 bg-[#2dd4bf]/30 p-px [clip-path:polygon(6px_0,calc(100%-6px)_0,100%_50%,calc(100%-6px)_100%,6px_100%,0_50%)]">
                    <div className="flex items-center justify-center bg-[#0a1615] px-4 py-1 font-mono text-[10px] tracking-widest text-[#2dd4bf] uppercase [clip-path:polygon(6px_0,calc(100%-6px)_0,100%_50%,calc(100%-6px)_100%,6px_100%,0_50%)]">
                      {t(`useCases.list.${item.id}.category`)}
                    </div>
                  </div>
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

                  <AppButton
                    isLink
                    linkTo="#"
                    variant="ghost"
                    className="group/link relative h-auto inline-flex items-center justify-center rounded border border-slate-700 bg-slate-800/50 px-4 py-1.5 font-mono text-[10px] font-bold tracking-widest text-slate-300 uppercase transition-all hover:border-[#2dd4bf]/50 hover:bg-[#2dd4bf]/10 hover:text-[#2dd4bf]"
                  >
                    {t('useCases.openDossier')}
                  </AppButton>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};