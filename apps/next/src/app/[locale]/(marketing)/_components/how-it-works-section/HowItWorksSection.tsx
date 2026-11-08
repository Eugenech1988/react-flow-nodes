'use client';

import { useState, useRef, useEffect } from 'react';
import { Gauge, Activity, Loader2 } from 'lucide-react';
import { SectionHeading, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { HOW_IT_WORKS_STEPS } from './constants';

export const HowItWorksSection = () => {
  const { t } = useT('marketing');
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleStepClick = (index: number) => {
    if (index === activeStep && !isLoading) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoadCount((c) => c + 1);
    setIsLoading(true);

    timeoutRef.current = setTimeout(() => {
      setActiveStep(index);
      setIsLoading(false);
    }, 600);
  };

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t border-[#2dd4bf]/10 bg-[#040a09] py-16 text-[#d1faf5] sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#5eead4_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.03]" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-150 w-200 -translate-x-1/2 rounded-full bg-[#2dd4bf]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          gradientDirection="left"
          title={t('howItWorks.heading.title')}
          description={t('howItWorks.heading.description')}
          isMain={false}
        />

        <div className="mt-12 grid grid-cols-1 items-stretch gap-8 sm:mt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Desktop accordion */}
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
                    <div
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-[#0a1210] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-colors duration-300 md:h-14 md:w-14 ${
                        isActive ? 'border-[#2dd4bf]' : 'border-[#2dd4bf]/20'
                      }`}
                    >
                      <div
                        className={`absolute -inset-1 rounded-full border border-[#2dd4bf] bg-[#2dd4bf]/20 shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-opacity duration-300 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
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
                          {t(`howItWorks.steps.${step.id}.title`)}
                        </h3>
                        <span className="font-mono text-xs tracking-widest text-[#2dd4bf]/70 uppercase">
                          {t(`howItWorks.steps.${step.id}.subtitle`)}
                        </span>
                      </div>

                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                          isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="mt-2 text-sm leading-relaxed text-slate-400 md:text-base">
                            {t(`howItWorks.steps.${step.id}.description`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Display monitor */}
          <div className="relative flex w-full flex-col rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/60 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-2 lg:h-full">
            <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-4 sm:left-4 sm:h-2 sm:w-2" />
            <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-4 sm:right-4 sm:h-2 sm:w-2" />
            <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:bottom-4 sm:left-4 sm:h-2 sm:w-2" />
            <span className="absolute right-3 bottom-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:right-4 sm:bottom-4 sm:h-2 sm:w-2" />

            <div className="relative flex min-h-95 w-full flex-col overflow-hidden rounded-[1.4rem] border border-slate-800 bg-slate-950/90 lg:h-full lg:flex-1">
              <div className="relative z-10 flex items-center justify-between border-b border-slate-800 bg-[#0d1f1e] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#2dd4bf]/80 sm:text-xs">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    SYS.WORKSPACE //{' '}
                    {t(
                      `howItWorks.steps.${HOW_IT_WORKS_STEPS[activeStep].id}.subtitle`,
                    ).toUpperCase()}
                  </span>
                  <span className="sm:hidden">
                    SYS.WORKSPACE //{' '}
                    {t(`howItWorks.steps.${HOW_IT_WORKS_STEPS[activeStep].id}.subtitle`)
                      .slice(0, 3)
                      .toUpperCase()}
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
                          aria-label={step.id}
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
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_1px,transparent_1.5px)] bg-size-[16px_16px]" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(4,10,9,0.85)_100%)]" />

                  {/* LOADER — всегда в DOM, скрывается через opacity */}
                  <div
                    className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-200 ${
                      isLoading ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                  >
                    <Loader2
                      className={`h-10 w-10 text-[#2dd4bf] drop-shadow-[0_0_10px_#2dd4bf] ${
                        isLoading ? 'animate-spin' : ''
                      }`}
                    />
                    <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">
                      <div
                        key={loadCount}
                        className="h-full animate-[fill-bar_0.6s_linear_forwards] bg-[#2dd4bf]"
                      />
                    </div>
                    <span className="mt-4 font-mono text-xs tracking-widest text-[#2dd4bf]/70 uppercase">
                      Initializing Module...
                    </span>
                  </div>

                  {/* CONTENT — все шаги в DOM, виден только активный */}
                  {HOW_IT_WORKS_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const visible = index === activeStep && !isLoading;

                    return (
                      <div
                        key={step.id}
                        className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          visible
                            ? 'blur-0 scale-100 opacity-100'
                            : 'pointer-events-none scale-95 opacity-0 blur-sm'
                        }`}
                      >
                        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-slate-700 bg-slate-900 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] sm:h-24 sm:w-24">
                          <div className="absolute inset-1.5 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-[#2dd4bf]/30 sm:inset-2" />
                          <Icon className="h-8 w-8 text-[#5eead4] drop-shadow-[0_0_15px_#2dd4bf] sm:h-10 sm:w-10" />
                        </div>

                        <h3 className="text-lg font-bold text-[#d1faf5] sm:text-xl md:text-2xl">
                          {t(`howItWorks.steps.${step.id}.title`)}
                        </h3>

                        <p className="mt-3 text-xs leading-relaxed text-slate-400 sm:text-sm md:text-base">
                          {t(`howItWorks.steps.${step.id}.description`)}
                        </p>
                      </div>
                    );
                  })}
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
                        <div
                          className="h-full rounded-full bg-slate-600"
                          style={{ animation: `pulse-width ${3 + i}s ease-in-out infinite` }}
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
          <AppButton
            isLink
            linkTo="http://localhost:5173"
            variant="primary"
            size="lg"
            className="mx-auto"
          >
            {t('howItWorks.cta')}
          </AppButton>
        </div>
      </div>
    </section>
  );
};
