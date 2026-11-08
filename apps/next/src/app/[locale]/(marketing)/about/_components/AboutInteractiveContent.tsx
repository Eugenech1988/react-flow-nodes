'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Cog,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Code2,
  CircleDot,
  HardDrive,
  Settings2,
  ChevronRight,
} from 'lucide-react';

import { AppButton, SectionHeading } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';
import { useInView } from '@/shared/hooks';

const values = [
  { id: '1', Icon: Cog, number: '01' },
  { id: '2', Icon: Zap, number: '02' },
  { id: '3', Icon: ShieldCheck, number: '03' },
];

const crew = [
  { id: '1', avatar: 'https://i.pravatar.cc/150?u=eugene' },
  { id: '2', avatar: 'https://i.pravatar.cc/150?u=jane' },
  { id: '3', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: '4', avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: '5', avatar: 'https://i.pravatar.cc/150?u=viktor' },
  { id: '6', avatar: 'https://i.pravatar.cc/150?u=sarah' },
];

export const AboutInteractiveContent = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { t } = useT('about');

  const { ref: missionRef, inView: missionInView } = useInView<HTMLElement>();
  const { ref: principlesRef, inView: principlesInView } = useInView<HTMLElement>();
  const { ref: crewRef, inView: crewInView } = useInView<HTMLElement>();
  const { ref: ctaRef, inView: ctaInView } = useInView<HTMLElement>();

  return (
    <div className="relative isolate overflow-hidden text-[#d1faf5]">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#2dd4bf_1px,transparent_0)] bg-size-[28px_28px] opacity-[0.025]" />

        <div className="absolute top-40 -left-48 h-[450px] w-[450px] rounded-full border border-[#2dd4bf]/[0.04]" />

        <div className="absolute top-[45%] -right-52 h-[500px] w-[500px] rounded-full border border-[#2dd4bf]/[0.04]" />

        <div className="absolute top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#2dd4bf]/[0.025] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-28 px-4 py-20 sm:px-6 lg:space-y-36">
        {/* MISSION */}
        <section
          ref={missionRef}
          className={`grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 ${
            missionInView
              ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
              : 'opacity-0'
          }`}
          style={{ animationFillMode: 'both' }}
        >
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#2dd4bf]/60" />

              <span className="font-mono text-[10px] tracking-[0.3em] text-[#2dd4bf]/80 uppercase">
                Our Mission
              </span>

              <span className="font-mono text-[10px] text-[#2dd4bf]/40">/ 001</span>
            </div>

            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('mission.title')}
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              {t('mission.description')}
            </p>

            <div className="mt-9 flex items-center gap-4">
              <div className="relative h-1 w-16 overflow-hidden rounded-full bg-[#2dd4bf]/10">
                <div className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-[#2dd4bf] shadow-[0_0_12px_rgba(45,212,191,0.5)]" />
              </div>

              <span className="font-mono text-[10px] tracking-[0.2em] text-[#2dd4bf]/70 uppercase">
                Engineering with purpose
              </span>
            </div>
          </div>

          {/* Mechanical illustration */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative flex aspect-square items-center justify-center">
              <div className="absolute h-[88%] w-[88%] rounded-full border border-[#2dd4bf]/15" />
              <div className="absolute h-[76%] w-[76%] rounded-full border border-dashed border-[#2dd4bf]/20" />
              <div className="absolute h-[62%] w-[62%] rounded-full border border-[#2dd4bf]/15" />
              <div className="absolute h-[48%] w-[48%] rounded-full border border-[#2dd4bf]/20" />

              {/* Connectors */}
              <div className="absolute top-[8%] left-1/2 h-[12%] w-px bg-[#2dd4bf]/30" />
              <div className="absolute bottom-[8%] left-1/2 h-[12%] w-px bg-[#2dd4bf]/30" />
              <div className="absolute top-1/2 left-[8%] h-px w-[12%] bg-[#2dd4bf]/30" />
              <div className="absolute top-1/2 right-[8%] h-px w-[12%] bg-[#2dd4bf]/30" />

              {/* Gears — нативный CSS spin */}
              <div
                style={{ animation: 'spin 40s linear infinite' }}
                className="absolute top-[20%] left-[9%] flex h-16 w-16 items-center justify-center text-[#2dd4bf]/50"
              >
                <Cog size={64} strokeWidth={0.8} />
              </div>

              <div
                style={{ animation: 'spin 32s linear infinite reverse' }}
                className="absolute right-[10%] bottom-[15%] flex h-20 w-20 items-center justify-center text-[#2dd4bf]/40"
              >
                <Settings2 size={76} strokeWidth={0.8} />
              </div>

              {/* Core */}
              <div className="relative z-10 flex h-36 w-36 flex-col items-center justify-center rounded-full border border-[#2dd4bf]/30 bg-[#07100f]/75 shadow-[0_0_50px_rgba(45,212,191,0.08),inset_0_0_30px_rgba(45,212,191,0.05)]">
                <div className="absolute inset-2 rounded-full border border-dashed border-[#2dd4bf]/25" />

                <Code2 size={38} strokeWidth={1.3} className="text-[#5eead4]" />

                <span className="mt-3 font-mono text-[9px] tracking-[0.25em] text-[#2dd4bf]/70">
                  CORE SYSTEM
                </span>
              </div>

              {/* Coordinates */}
              <div className="absolute top-1/2 left-0 font-mono text-[9px] tracking-widest text-[#2dd4bf]/40">
                X: 001
              </div>
              <div className="absolute top-1/2 right-0 font-mono text-[9px] tracking-widest text-[#2dd4bf]/40">
                Y: 002
              </div>
              <div className="absolute bottom-0 flex items-center gap-2 font-mono text-[9px] tracking-widest text-[#2dd4bf]/60 uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf]" />
                System operational
              </div>
            </div>
          </div>
        </section>

        {/* ENGINEERING PRINCIPLES */}
        <section ref={principlesRef}>
          <div className="mb-12">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#2dd4bf]/60" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#2dd4bf]/80 uppercase">
                Engineering principles
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Rebuilding Protocol
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              A foundation built on thoughtful engineering, continuous improvement, and reliable
              systems.
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-8 bottom-8 left-[27px] hidden w-px bg-gradient-to-b from-[#2dd4bf]/50 via-[#2dd4bf]/20 to-transparent sm:block" />

            <div className="space-y-4">
              {values.map(({ id, Icon, number }, index) => (
                <div
                  key={id}
                  className={`group relative overflow-hidden rounded-xl border border-[#2dd4bf]/15 bg-[#0b1715]/30 p-5 transition-all duration-300 hover:border-[#2dd4bf]/30 hover:bg-[#0b1715]/55 sm:p-7 ${
                    principlesInView
                      ? 'animate-in fade-in slide-in-from-left-5 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                      : 'opacity-0'
                  }`}
                  style={{
                    animationDelay: principlesInView ? `${index * 120}ms` : '0ms',
                    animationFillMode: 'both',
                  }}
                >
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-[#2dd4bf]/5 transition-colors group-hover:bg-[#2dd4bf]/10" />

                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                    <div className="flex shrink-0 items-center gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 text-[#2dd4bf]/80 transition-all group-hover:border-[#2dd4bf]/40 group-hover:bg-[#2dd4bf]/10 group-hover:text-[#5eead4]">
                        <Icon size={25} strokeWidth={1.4} />
                      </div>

                      <div className="sm:hidden">
                        <span className="font-mono text-[9px] tracking-widest text-[#2dd4bf]/50">
                          DIRECTIVE
                        </span>
                        <div className="font-mono text-xl font-semibold text-[#2dd4bf]/70">
                          {number}
                        </div>
                      </div>

                      <span className="hidden font-mono text-3xl font-light text-[#2dd4bf]/35 sm:block">
                        {number}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 hidden items-center gap-2 sm:flex">
                        <span className="font-mono text-[9px] tracking-[0.2em] text-[#2dd4bf]/50 uppercase">
                          Directive {number}
                        </span>
                        <span className="h-px w-8 bg-[#2dd4bf]/20" />
                        <span className="font-mono text-[9px] tracking-widest text-[#2dd4bf]/60">
                          ACTIVE
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-[#d1faf5] transition-colors group-hover:text-white sm:text-xl">
                        {t(`values.list.${id}.title`)}
                      </h3>

                      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
                        {t(`values.list.${id}.description`)}
                      </p>
                    </div>

                    <div className="hidden shrink-0 items-center justify-center sm:flex">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2dd4bf]/15 text-[#2dd4bf]/40 transition-all group-hover:border-[#2dd4bf]/40 group-hover:text-[#2dd4bf]">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CREW */}
        <section ref={crewRef}>
          <SectionHeading
            title={t('crew.title')}
            description={t('crew.description')}
            isMain={false}
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {crew.map((member, index) => (
              <div
                key={member.id}
                className={`group relative overflow-hidden rounded-xl border border-[#2dd4bf]/15 bg-[#0b1715]/35 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#2dd4bf]/35 hover:bg-[#0b1715]/60 ${
                  crewInView
                    ? 'animate-in fade-in slide-in-from-bottom-5 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                    : 'opacity-0'
                }`}
                style={{
                  animationDelay: crewInView ? `${(index % 3) * 100}ms` : '0ms',
                  animationFillMode: 'both',
                }}
              >
                <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#2dd4bf]/[0.035] blur-2xl transition-all group-hover:bg-[#2dd4bf]/10" />

                <div className="relative flex items-center gap-4">
                  <div className="relative h-17 w-17 shrink-0 rounded-full border border-[#2dd4bf]/30 p-0.75 transition-colors group-hover:border-[#2dd4bf]/70">
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-[#07100f]">
                      <Image
                        src={member.avatar}
                        alt={t(`crew.list.${member.id}.name`)}
                        fill
                        sizes="68px"
                        className="object-cover grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                      />
                    </div>

                    <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-[#0b1715] bg-[#2dd4bf]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="mb-1 block font-mono text-[9px] tracking-[0.2em] text-[#2dd4bf]/50 uppercase">
                      Personnel / 0{member.id}
                    </span>

                    <h3 className="truncate text-base font-semibold text-[#d1faf5] transition-colors group-hover:text-white">
                      {t(`crew.list.${member.id}.name`)}
                    </h3>

                    <p className="mt-1 truncate font-mono text-[10px] tracking-[0.12em] text-[#2dd4bf]/65 uppercase">
                      {t(`crew.list.${member.id}.role`)}
                    </p>
                  </div>
                </div>

                <div className="relative mt-5 flex items-center justify-between border-t border-[#2dd4bf]/10 pt-4">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-slate-500 uppercase">
                    Team member
                  </span>

                  <div className="flex items-center gap-2 text-[#2dd4bf]/45 transition-colors group-hover:text-[#2dd4bf]">
                    <CircleDot size={12} />
                    <span className="font-mono text-[9px] tracking-widest uppercase">Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT CTA */}
        <section
          ref={ctaRef}
          className={`relative pb-10 ${
            ctaInView
              ? 'animate-in fade-in slide-in-from-bottom-5 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
              : 'opacity-0'
          }`}
          style={{ animationFillMode: 'both' }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-[#2dd4bf]/20 bg-[#0b1715]/35 px-6 py-12 sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full border border-[#2dd4bf]/10" />
              <div className="absolute -top-24 -right-12 h-64 w-64 rounded-full border border-dashed border-[#2dd4bf]/10" />
              <div className="absolute -top-16 -right-5 h-48 w-48 rounded-full border border-[#2dd4bf]/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(45,212,191,0.055),transparent_40%)]" />
              <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-[#2dd4bf]/30 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-between gap-10 text-center md:flex-row md:text-left">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2dd4bf] opacity-40" />
                    <span className="relative h-2 w-2 rounded-full bg-[#2dd4bf]" />
                  </span>

                  <span className="font-mono text-[10px] tracking-[0.3em] text-[#2dd4bf]/80 uppercase">
                    Open for collaboration
                  </span>
                </div>

                <h2 className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {t('cta.title')}
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  {t('cta.description')}
                </p>

                <div className="mt-7 flex items-center justify-center gap-3 md:justify-start">
                  <span className="h-px w-8 bg-[#2dd4bf]/40" />

                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#2dd4bf]/60 uppercase">
                    Let&apos;s build something meaningful
                  </span>
                </div>
              </div>

              <div className="relative shrink-0">
                <div className="absolute -inset-2 rounded-xl border border-dashed border-[#2dd4bf]/15" />

                <AppButton
                  variant="primary"
                  size="lg"
                  icon={ArrowUpRight}
                  iconClassName="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  className="relative min-w-50 shrink-0"
                  onClick={() => setIsContactOpen(true)}
                >
                  {t('cta.button')}
                </AppButton>
              </div>
            </div>

            <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#2dd4bf]/10 pt-5">
              <div className="flex items-center gap-2">
                <HardDrive size={13} className="text-[#2dd4bf]/50" />
                <span className="font-mono text-[9px] tracking-widest text-slate-500 uppercase">
                  Contact terminal
                </span>
              </div>

              <span className="font-mono text-[9px] tracking-widest text-[#2dd4bf]/50 uppercase">
                Connection available
              </span>
            </div>
          </div>
        </section>
      </div>
      <InquiryModal type="contact" isOpen={isContactOpen} onOpenChange={setIsContactOpen} />
    </div>
  );
};
