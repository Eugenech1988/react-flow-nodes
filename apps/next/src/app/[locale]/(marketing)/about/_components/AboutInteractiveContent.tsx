
'use client';

import Image from 'next/image';
import { m } from 'framer-motion';
import {
  Cog,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Code2,
  Cpu,
  Activity,
  CircleDot,
} from 'lucide-react';

import { AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';

const values = [
  { id: '1', Icon: Cog },
  { id: '2', Icon: Zap },
  { id: '3', Icon: ShieldCheck },
];

const crew = [
  { id: '1', avatar: 'https://i.pravatar.cc/150?u=eugene' },
  { id: '2', avatar: 'https://i.pravatar.cc/150?u=jane' },
  { id: '3', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: '4', avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: '5', avatar: 'https://i.pravatar.cc/150?u=viktor' },
  { id: '6', avatar: 'https://i.pravatar.cc/150?u=sarah' },
];

const Rivet = ({ position }: { position: string }) => (
  <span
    className={`absolute ${position} z-10 h-2 w-2 rounded-full border border-teal-700/60 bg-gradient-to-br from-teal-300 via-teal-700 to-[#10231f] shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}
  />
);

const SectionHeading = ({
                          children,
                        }: {
  children: React.ReactNode;
}) => (
  <div className="mb-10">
    <div className="mb-4 flex items-center gap-3">
      <span className="h-px w-8 bg-teal-500/60" />
      <span className="font-mono text-[10px] tracking-[0.25em] text-teal-400/70 uppercase">
        Pipeline Studio
      </span>
    </div>
    {children}
  </div>
);

export const AboutInteractiveContent = () => {
  const { t } = useT('about');

  return (
    <div className="relative isolate overflow-hidden bg-[#040a09] text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-64 top-20 h-[600px] w-[600px] rounded-full bg-teal-500/[0.07] blur-[150px]" />
        <div className="absolute -right-64 top-[40%] h-[600px] w-[600px] rounded-full bg-cyan-500/[0.05] blur-[150px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(45,212,191,0.055)_1px,transparent_0)] bg-size-[32px_32px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-28 px-6 py-24 lg:space-y-40 lg:px-8">

        {/* MISSION */}
        <m.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20"
        >
          <div>
            <div className="mb-7 flex items-center gap-3">
              <Activity className="h-4 w-4 text-teal-400" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-teal-400/80 uppercase">
                Mission / 001
              </span>
              <span className="h-px w-16 bg-gradient-to-r from-teal-500/60 to-transparent" />
            </div>

            <h2 className="max-w-2xl text-4xl leading-[1.12] font-semibold tracking-tight text-[#eee8dc] sm:text-5xl lg:text-[3.5rem]">
              {t('mission.title')}
            </h2>

            <p className="mt-8 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              {t('mission.description')}
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px w-12 bg-teal-500/60" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase">
                Engineering with purpose
              </span>
            </div>
          </div>

          {/* Engineering instrument */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-8 rounded-full bg-teal-500/[0.07] blur-[80px]" />

            <div className="relative border border-teal-700/50 bg-[#0a1210] p-1 shadow-[0_25px_80px_rgba(0,0,0,0.5)]">
              <div className="relative overflow-hidden border border-teal-700/30 p-7 sm:p-9">

                <Rivet position="top-2 left-2" />
                <Rivet position="top-2 right-2" />
                <Rivet position="bottom-2 left-2" />
                <Rivet position="bottom-2 right-2" />

                {/* Technical drawing */}
                <div className="pointer-events-none absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.07)_1px,transparent_1px)] bg-size-[24px_24px]" />
                  <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-teal-700/30" />
                  <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full border border-dashed border-teal-700/30" />
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between border-b border-teal-800/40 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center border border-teal-600/40 bg-gradient-to-br from-teal-500/20 to-transparent text-teal-400">
                        <Code2 size={21} strokeWidth={1.5} />
                      </div>

                      <div>
                        <span className="block font-mono text-xs tracking-widest text-[#d4ded8] uppercase">
                          Core Engine
                        </span>
                        <span className="mt-1 block font-mono text-[9px] tracking-wider text-slate-500">
                          ARCHITECTURE / SYSTEM
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] text-teal-500/60">
                      SYS.001
                    </span>
                  </div>

                  {/* Main instrument */}
                  <div className="flex items-center justify-center py-10">
                    <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-teal-700/40 bg-[#080f0d] shadow-[inset_0_0_35px_rgba(0,0,0,0.9),0_0_30px_rgba(45,212,191,0.05)]">
                      <div className="absolute inset-2 rounded-full border border-dashed border-teal-700/40" />
                      <div className="absolute inset-5 rounded-full border border-teal-700/30" />

                      <div className="absolute h-full w-px bg-teal-500/15" />
                      <div className="absolute h-px w-full bg-teal-500/15" />

                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-teal-500/40 bg-gradient-to-br from-[#15332d] to-[#0a1210] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_20px_rgba(45,212,191,0.12)]">
                        <Cpu size={34} strokeWidth={1.2} className="text-teal-400" />
                      </div>

                      <span className="absolute -top-1 font-mono text-[8px] text-teal-500/70">N</span>
                      <span className="absolute -bottom-1 font-mono text-[8px] text-teal-500/70">S</span>
                      <span className="absolute -left-1 font-mono text-[8px] text-teal-500/70">W</span>
                      <span className="absolute -right-1 font-mono text-[8px] text-teal-500/70">E</span>
                    </div>
                  </div>

                  {/* System components */}
                  <div className="space-y-4 border-t border-teal-800/40 pt-6">
                    {[
                      { label: 'Engineering', value: '01', opacity: '100%' },
                      { label: 'Technology', value: '02', opacity: '70%' },
                      { label: 'Product thinking', value: '03', opacity: '45%' },
                    ].map((item) => (
                      <div
                        key={item.value}
                        className="flex items-center gap-4"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                          style={{ opacity: item.opacity }}
                        />
                        <span className="flex-1 font-mono text-xs tracking-wide text-slate-400">
                          {item.label}
                        </span>
                        <span className="font-mono text-[10px] text-teal-600/70">
                          {item.value}
                        </span>
                        <div className="h-1 w-12 overflow-hidden bg-[#18231f]">
                          <div
                            className="h-full bg-gradient-to-r from-teal-800 to-teal-400"
                            style={{ width: item.opacity }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex items-center justify-between border-t border-teal-800/40 pt-5">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                      <span className="font-mono text-[9px] tracking-widest text-teal-400/70 uppercase">
                        Operational
                      </span>
                    </div>

                    <span className="font-mono text-[9px] tracking-wider text-slate-500">
                      BUILD / IMPROVE / REPEAT
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative corner line */}
            <div className="absolute -bottom-3 -right-3 h-12 w-12 border-b border-r border-teal-600/40" />
            <div className="absolute -left-3 -top-3 h-12 w-12 border-l border-t border-teal-600/40" />
          </div>
        </m.section>

        {/* VALUES */}
        <m.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading>
            <h2 className="text-3xl font-semibold tracking-tight text-[#eee8dc] sm:text-4xl">
              {t('values.title')}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
              {t('values.description')}
            </p>
          </SectionHeading>

          <div className="border-y border-teal-800/40">
            {values.map(({ id, Icon }, index) => (
              <m.div
                key={id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative flex items-start gap-5 border-b border-teal-800/30 py-7 last:border-b-0 sm:items-center sm:gap-8 sm:py-8"
              >
                <span className="w-8 shrink-0 pt-1 font-mono text-xs text-teal-600/70 sm:pt-0">
                  0{id}
                </span>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-teal-700/40 bg-[#0d1916] text-teal-400 transition-all duration-300 group-hover:border-teal-500/60 group-hover:bg-[#10231f] group-hover:text-teal-300">
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="transition-transform duration-500 group-hover:rotate-12"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-medium tracking-wide text-[#deded5] transition-colors group-hover:text-teal-300 sm:text-lg">
                    {t(`values.list.${id}.title`)}
                  </h3>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    {t(`values.list.${id}.description`)}
                  </p>
                </div>

                <ArrowUpRight
                  size={18}
                  className="mt-1 shrink-0 text-teal-800/60 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-teal-400 sm:mt-0"
                />
              </m.div>
            ))}
          </div>
        </m.section>

        {/* CREW */}
        <m.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading>
            <h2 className="text-3xl font-semibold tracking-tight text-[#eee8dc] sm:text-4xl">
              {t('crew.title')}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
              {t('crew.description')}
            </p>
          </SectionHeading>

          <div className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {crew.map((member, index) => (
              <m.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (index % 3) * 0.07 }}
                className="group flex items-center gap-4 border-b border-teal-800/30 py-5"
              >
                <div className="relative h-11 w-11 shrink-0 rounded-full border border-teal-700/50 p-[3px] transition-colors group-hover:border-teal-400">
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-[#0d1916]">
                    <Image
                      src={member.avatar}
                      alt={t(`crew.list.${member.id}.name`)}
                      fill
                      sizes="44px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-[#deded5] transition-colors group-hover:text-teal-300">
                    {t(`crew.list.${member.id}.name`)}
                  </h3>

                  <p className="mt-1 truncate font-mono text-[9px] tracking-[0.12em] text-slate-500 uppercase">
                    {t(`crew.list.${member.id}.role`)}
                  </p>
                </div>

                <CircleDot
                  size={12}
                  className="shrink-0 text-teal-800/60 transition-colors group-hover:text-teal-400"
                />
              </m.div>
            ))}
          </div>
        </m.section>

        {/* CTA */}
        <m.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="relative border border-teal-700/50 bg-[#0a1210] p-1 shadow-[0_25px_80px_rgba(0,0,0,0.4)]">
            <div className="relative overflow-hidden border border-teal-800/40 px-7 py-12 sm:px-12 sm:py-14 lg:px-16">

              <Rivet position="top-2 left-2" />
              <Rivet position="top-2 right-2" />
              <Rivet position="bottom-2 left-2" />
              <Rivet position="bottom-2 right-2" />

              {/* Background details */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 -top-40 h-96 w-96 rounded-full border border-teal-700/20" />
                <div className="absolute -right-12 -top-32 h-80 w-80 rounded-full border border-dashed border-teal-700/20" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.035)_1px,transparent_1px)] bg-size-[32px_32px]" />
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-teal-500/[0.06] blur-[100px]" />
              </div>

              <div className="relative flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
                    </span>

                    <span className="font-mono text-[10px] tracking-[0.25em] text-teal-400/80 uppercase">
                      System ready / 003
                    </span>
                  </div>

                  <h2 className="text-3xl leading-tight font-semibold tracking-tight text-[#eee8dc] sm:text-4xl">
                    {t('cta.title')}
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                    {t('cta.description')}
                  </p>
                </div>

                <InquiryModal type="contact">
                  <AppButton
                    variant="ghost"
                    size="lg"
                    icon={ArrowUpRight}
                    iconClassName="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    className="group relative shrink-0 rounded-none border border-teal-700/60 bg-gradient-to-b from-[#15332d] to-[#0d1f1b] px-8 py-4 font-mono text-xs font-semibold tracking-[0.15em] text-teal-300 uppercase shadow-[inset_0_1px_0_rgba(153,246,228,0.1),0_4px_0_#050b09] transition-all duration-200 hover:border-teal-400 hover:from-[#194239] hover:to-[#102a24] hover:text-teal-100 active:translate-y-1 active:shadow-none"
                  >
                    {t('cta.button')}
                  </AppButton>
                </InquiryModal>
              </div>
            </div>
          </div>

          {/* Bottom mechanical detail */}
          <div className="mx-8 flex items-center justify-between border-x border-b border-teal-800/40 px-4 py-2">
            <span className="font-mono text-[8px] tracking-[0.2em] text-teal-700/70">
              PIPELINE STUDIO
            </span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-teal-700/70">
              EST. ENGINEERING
            </span>
          </div>
        </m.section>
      </div>
    </div>
  );
};
