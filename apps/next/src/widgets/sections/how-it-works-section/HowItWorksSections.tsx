'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Network, Sliders, Play, Activity, Flame, ArrowRight, Gauge } from 'lucide-react';
import { SectionHeading } from '@/shared/ui';
import Link from 'next/link';

const steps = [
  {
    id: 'design',
    title: 'Drag and Connect Nodes',
    subtitle: 'Design Phase',
    description:
      'Select from over 100+ pre-built triggers, actions, and logical operators. Drag them onto the zero-lag canvas and route your data by connecting matching output-to-input ports.',
    icon: Network,
  },
  {
    id: 'validate',
    title: 'Configure Payloads',
    subtitle: 'Validation Phase',
    description:
      'Click on any node to open its properties. Map incoming JSON fields, write custom mapping expressions with autocomplete support, and let our strict schema engine validate your connections.',
    icon: Sliders,
  },
  {
    id: 'deploy',
    title: 'Deploy and Run',
    subtitle: 'Production Phase',
    description:
      'Hit Deploy to publish your workspace. Your workflow immediately compiles into a highly optimized, stateful execution pipeline running on global edge nodes.',
    icon: Play,
  },
  {
    id: 'monitor',
    title: 'Monitor Pipeline Health',
    subtitle: 'Telemetry Phase',
    description:
      'Watch real-time pressure gauges and throughput metrics. Our built-in observability suite catches bottlenecks before they cause a system failure.',
    icon: Activity,
  },
  {
    id: 'scale',
    title: 'Scale Infrastructure',
    subtitle: 'Expansion Phase',
    description:
      'Allocate more compute to your boilers. The system automatically provisions additional edge workers to handle traffic spikes without breaking a sweat.',
    icon: Flame,
  },
];

export const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const ActiveIcon = steps[activeStep].icon;

  return (
    <section className="relative overflow-hidden border-t border-[#2dd4bf]/10 bg-[#040a09] pt-28 pb-16 text-[#d1faf5] sm:pt-36 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#5eead4_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.03]" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-150 w-200 -translate-x-1/2 rounded-full bg-[#2dd4bf]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="How It Works"
          description="Go from a blank canvas to a production-ready, event-driven API in five mechanical steps. No complex infra hosting required."
          isMain={false}
        />

        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="relative hidden lg:flex lg:flex-col">
            <div className="absolute top-0 bottom-0 left-6 w-2 rounded-full border-x border-slate-800 bg-slate-900 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] md:left-8" />

            <div className="flex flex-col gap-2">
              {steps.map((step, index) => {
                const isActive = index === activeStep;
                const Icon = step.icon;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    className={`group relative flex w-full cursor-pointer items-start gap-5 rounded-2xl p-4 text-left transition-all duration-300 md:gap-6 md:p-5 ${
                      isActive ? 'bg-[#0d1f1e]/80' : 'hover:bg-[#0d1f1e]/40'
                    }`}
                  >
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-[#0a1210] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] md:h-14 md:w-14">
                      {isActive && (
                        <motion.div
                          layoutId="active-pipe-glow"
                          className="absolute -inset-1 rounded-full border border-[#2dd4bf] bg-[#2dd4bf]/20 shadow-[0_0_20px_rgba(45,212,191,0.4)]"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}

                      <Icon
                        className={`relative z-10 h-5 w-5 transition-colors duration-300 md:h-6 md:w-6 ${
                          isActive
                            ? 'text-[#5eead4] drop-shadow-[0_0_8px_#2dd4bf]'
                            : 'text-slate-600 group-hover:text-slate-400'
                        }`}
                      />
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3
                          className={`text-base font-bold transition-colors duration-300 md:text-lg ${
                            isActive
                              ? 'text-[#d1faf5]'
                              : 'text-slate-400 group-hover:text-slate-300'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <span className="font-mono text-xs tracking-widest text-[#2dd4bf]/70 uppercase">
                          {step.subtitle}
                        </span>
                      </div>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            initial={{ height: 0, opacity: 0, y: -10 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="mt-2 overflow-hidden text-sm leading-relaxed text-slate-400 md:text-base"
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex w-full items-center justify-center rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/60 p-1 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-1.5">
            <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-4 sm:left-4 sm:h-2 sm:w-2" />
            <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-4 sm:right-4 sm:h-2 sm:w-2" />
            <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:bottom-4 sm:left-4 sm:h-2 sm:w-2" />
            <span className="absolute right-3 bottom-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:right-4 sm:bottom-4 sm:h-2 sm:w-2" />

            <div className="relative flex w-full flex-col overflow-hidden rounded-[1.4rem] border border-slate-800 bg-slate-950/90">
              <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.05)_1px,transparent_1px)] bg-size-[2rem_2rem]" />

              <div className="relative z-10 flex items-center justify-between border-b border-slate-800 bg-[#0d1f1e] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#d1faf5] sm:text-base">
                  <span>{steps[activeStep].title}</span>
                </div>
                <div className="hidden font-mono text-[10px] tracking-widest text-[#2dd4bf]/70 uppercase sm:block sm:text-xs">
                  {steps[activeStep].subtitle}
                </div>
              </div>

              <div className="relative z-10 flex flex-1 overflow-hidden">
                <div className="flex w-17 shrink-0 flex-col items-center border-r border-slate-800/80 bg-[#0a1210]/80 py-4 sm:w-20 sm:py-6">
                  <div className="flex flex-col gap-4 sm:gap-5">
                    {steps.map((step, index) => {
                      const isActive = index === activeStep;
                      const Icon = step.icon;
                      return (
                        <button
                          key={step.id}
                          onClick={() => setActiveStep(index)}
                          className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-12 sm:w-12 ${
                            isActive
                              ? 'border-[#2dd4bf] bg-[#2dd4bf]/20 shadow-[0_0_15px_rgba(45,212,191,0.5)]'
                              : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 transition-colors sm:h-5 sm:w-5 ${
                              isActive
                                ? 'text-[#5eead4] drop-shadow-[0_0_5px_#2dd4bf]'
                                : 'text-slate-500'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative flex flex-1 items-center justify-center p-4 sm:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="flex w-full max-w-sm flex-col items-center text-center"
                    >
                      <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-slate-700 bg-slate-900 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] sm:mb-6 sm:h-24 sm:w-24">
                        <div className="absolute inset-1.5 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-[#2dd4bf]/30 sm:inset-2" />
                        <ActiveIcon className="h-8 w-8 text-[#5eead4] drop-shadow-[0_0_15px_#2dd4bf] sm:h-10 sm:w-10" />
                      </div>

                      <h4 className="text-lg font-bold text-[#d1faf5] sm:text-xl md:text-2xl">
                        {steps[activeStep].title}
                      </h4>

                      <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm md:text-base">
                        {steps[activeStep].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-2 border-t border-slate-800 bg-[#0d1f1e] px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Gauge className="h-4 w-4 text-slate-600 sm:h-5 sm:w-5" />
                    <div className="mt-1.5 h-1 w-full rounded-full bg-slate-800 sm:mt-2">
                      <motion.div
                        animate={{ width: ['20%', '80%', '20%'] }}
                        transition={{ repeat: Infinity, duration: 3 + i, ease: 'easeInOut' }}
                        className="h-full rounded-full bg-slate-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center sm:mt-20">
          <Link
            href="/start"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-teal-900/40 bg-linear-to-r from-teal-500 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_4px_14px_rgba(57,179,155,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_22px_rgba(57,179,155,0.5)] active:scale-[0.98] sm:px-8 sm:py-4 sm:text-base"
          >
            Start Building Free
            <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
