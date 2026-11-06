'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Gauge, Activity, Loader2 } from 'lucide-react';
import { SectionHeading } from '@/shared/ui';
import Link from 'next/link';
import { HOW_IT_WORKS_STEPS } from '@/widgets/sections/how-it-works-section/model';

export const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ActiveIcon = HOW_IT_WORKS_STEPS[activeStep].icon;

  const handleStepClick = (index: number) => {
    if (index === activeStep && !isLoading) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(true);

    timeoutRef.current = setTimeout(() => {
      setActiveStep(index);
      setIsLoading(false);
    }, 600);
  };

  return (
    <section className="relative overflow-hidden border-t border-[#2dd4bf]/10 bg-[#040a09] py-16 text-[#d1faf5] sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#5eead4_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.03]" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-150 w-200 -translate-x-1/2 rounded-full bg-[#2dd4bf]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="How It Works"
          description="Go from a blank canvas to a production-ready, event-driven API in five mechanical steps. No complex infra hosting required."
          isMain={false}
        />

        <div className="mt-12 grid grid-cols-1 items-stretch gap-8 sm:mt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">

          <div className="relative hidden lg:flex lg:flex-col">
            <div className="flex flex-col gap-2">
              {HOW_IT_WORKS_STEPS.map((step, index) => {
                const isActive = index === activeStep;
                const Icon = step.icon;

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
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

          <div className="relative flex w-full flex-col rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/60 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-2 lg:h-full">

            <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-4 sm:left-4 sm:h-2 sm:w-2" />
            <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-4 sm:right-4 sm:h-2 sm:w-2" />
            <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:bottom-4 sm:left-4 sm:h-2 sm:w-2" />
            <span className="absolute right-3 bottom-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:right-4 sm:bottom-4 sm:h-2 sm:w-2" />

            <div className="relative flex min-h-[380px] w-full flex-col overflow-hidden rounded-[1.4rem] border border-slate-800 bg-slate-950/90 lg:h-full lg:flex-1">

              {/* Шапка монитора */}
              <div className="relative z-10 flex items-center justify-between border-b border-slate-800 bg-[#0d1f1e] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#2dd4bf]/80 sm:text-xs">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    SYS.WORKSPACE // {HOW_IT_WORKS_STEPS[activeStep].subtitle.toUpperCase()}
                  </span>
                  <span className="sm:hidden">
                    SYS.WORKSPACE // {HOW_IT_WORKS_STEPS[activeStep].subtitle.slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500/50" />
                  <span className="h-2 w-2 rounded-full bg-yellow-500/50" />
                  <span className="h-2 w-2 rounded-full bg-green-500/50 shadow-[0_0_5px_#22c55e]" />
                </div>
              </div>

              <div className="relative flex flex-1 overflow-hidden">

                <div className="flex w-16 shrink-0 flex-col items-center justify-center border-r border-slate-800/80 bg-[#0a1210]/80 py-4 lg:hidden">
                  <div className="flex flex-col gap-4">
                    {HOW_IT_WORKS_STEPS.map((step, index) => {
                      const isActive = index === activeStep;
                      const Icon = step.icon;
                      return (
                        <button
                          key={step.id}
                          onClick={() => handleStepClick(index)}
                          className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 ${
                            isActive
                              ? 'border-[#2dd4bf] bg-[#2dd4bf]/20 shadow-[0_0_15px_rgba(45,212,191,0.5)]'
                              : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 transition-colors ${
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

                <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6 sm:p-8">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_1px,transparent_1.5px)] bg-[size:16px_16px]" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(4,10,9,0.85)_100%)]" />

                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center text-center"
                      >
                        <Loader2 className="h-10 w-10 animate-spin text-[#2dd4bf] drop-shadow-[0_0_10px_#2dd4bf]" />
                        <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.6, ease: 'linear' }}
                            className="h-full bg-[#2dd4bf]"
                          />
                        </div>
                        <span className="mt-4 font-mono text-xs tracking-widest text-[#2dd4bf]/70 uppercase">
                          Initializing Module...
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative z-10 flex w-full max-w-sm flex-col items-center text-center"
                      >
                        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-slate-700 bg-slate-900 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] sm:h-24 sm:w-24">
                          <div className="absolute inset-1.5 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-[#2dd4bf]/30 sm:inset-2" />
                          <ActiveIcon className="h-8 w-8 text-[#5eead4] drop-shadow-[0_0_15px_#2dd4bf] sm:h-10 sm:w-10" />
                        </div>

                        <h4 className="text-lg font-bold text-[#d1faf5] sm:text-xl md:text-2xl">
                          {HOW_IT_WORKS_STEPS[activeStep].title}
                        </h4>

                        <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm md:text-base">
                          {HOW_IT_WORKS_STEPS[activeStep].description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between border-t border-slate-800 bg-[#0d1f1e] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf]" />
                  SYSTEM ONLINE
                </div>

                <div className="flex items-center gap-3 sm:gap-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex w-10 flex-col items-center sm:w-14">
                      <Gauge className="h-3.5 w-3.5 text-slate-500 sm:h-4 sm:w-4" />
                      <div className="mt-1 h-1 w-full rounded-full bg-slate-800">
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