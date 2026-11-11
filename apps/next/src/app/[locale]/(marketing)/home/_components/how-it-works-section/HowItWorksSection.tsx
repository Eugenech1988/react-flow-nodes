'use client';

import { useState, useRef, useEffect } from 'react';
import { Gauge, Activity, Loader2, ShieldCheck } from 'lucide-react';
import { Section, SectionDecorator, Frame, SectionHeading, AppButton } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { HOW_IT_WORKS_STEPS } from './constants';
import { APP_LOGIN_URL } from '@/shared/lib/app-url';

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
    <Section id="how-it-works">
      <SectionDecorator icon={Activity} position="top-left" opacity={0.02} />
      <SectionDecorator icon={ShieldCheck} position="bottom-right" opacity={0.02} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          gradientDirection="left"
          title={t('howItWorks.heading.title')}
          description={t('howItWorks.heading.description')}
          isMain={false}
        />

        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 sm:mt-16 sm:gap-8 lg:mt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="relative hidden lg:flex lg:flex-col">
            <div className="flex flex-col gap-2">
              {HOW_IT_WORKS_STEPS.map((step, index) => {
                const isActive = index === activeStep;
                const Icon = step.icon;

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    type="button"
                    aria-pressed={isActive}
                    className={`group relative flex w-full cursor-pointer items-start gap-4 rounded-2xl p-4 text-left transition-all duration-300 md:gap-6 md:p-5 ${isActive ? 'bg-theme-panel/80' : 'hover:bg-theme-panel/40'}`}
                  >
                    <div
                      className={`bg-theme-surface relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] transition-colors duration-300 md:h-14 md:w-14 ${isActive ? 'border-theme-accent' : 'border-theme-accent/20'}`}
                    >
                      <div
                        className={`border-theme-accent bg-theme-accent/20 absolute -inset-1 rounded-full border shadow-[0_0_20px_var(--theme-accent)] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                      />
                      <Icon
                        className={`relative z-10 h-5 w-5 transition-colors duration-300 md:h-6 md:w-6 ${isActive ? 'text-theme-accent-hover drop-shadow-[0_0_8px_var(--theme-accent)]' : 'text-theme-dim group-hover:text-theme-muted'}`}
                      />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3
                          className={`text-base font-bold transition-colors duration-300 md:text-lg ${isActive ? 'text-theme-fg' : 'text-theme-muted group-hover:text-theme-fg'}`}
                        >
                          {t(`howItWorks.steps.${step.id}.title`)}
                        </h3>
                        <span className="text-theme-accent/70 font-mono text-xs tracking-widest uppercase">
                          {t(`howItWorks.steps.${step.id}.subtitle`)}
                        </span>
                      </div>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-theme-muted mt-2 text-sm leading-relaxed md:text-base">
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

          <Frame
            headerTitle={`SYS.WORKSPACE // ${t(`howItWorks.steps.${HOW_IT_WORKS_STEPS[activeStep].id}.subtitle`).toUpperCase()}`}
            className="lg:h-full"
          >
            <div className="relative flex flex-1 overflow-hidden">
              <div className="border-theme-line bg-theme-surface/80 flex w-12 shrink-0 flex-col items-center justify-center border-r py-4 sm:w-16 lg:hidden">
                <div className="flex flex-col gap-3 sm:gap-4">
                  {HOW_IT_WORKS_STEPS.map((step, index) => {
                    const isActive = index === activeStep;
                    const Icon = step.icon;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        aria-pressed={isActive}
                        aria-label={t(`howItWorks.steps.${step.id}.title`)}
                        onClick={() => handleStepClick(index)}
                        className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-10 sm:w-10 ${isActive ? 'border-theme-accent bg-theme-accent/20 shadow-[0_0_15px_var(--theme-accent)]' : 'border-theme-line bg-theme-panel/50 hover:border-theme-muted'}`}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 transition-colors sm:h-4 sm:w-4 ${isActive ? 'text-theme-accent-hover drop-shadow-[0_0_5px_var(--theme-accent)]' : 'text-theme-dim'}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative flex min-h-80 flex-1 items-center justify-center overflow-hidden p-4 sm:min-h-90 sm:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--theme-accent)_8%,transparent)_1px,transparent_1.5px)] bg-size-[16px_16px]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--theme-bg)_85%)]" />

                <div
                  aria-hidden={!isLoading}
                  className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center transition-opacity duration-200 sm:px-6 ${isLoading ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                >
                  <Loader2
                    className={`text-theme-accent h-8 w-8 drop-shadow-[0_0_10px_var(--theme-accent)] sm:h-10 sm:w-10 ${isLoading ? 'animate-spin motion-reduce:animate-none' : ''}`}
                  />
                  <div className="bg-theme-panel mt-4 h-1.5 w-40 overflow-hidden rounded-full sm:mt-6 sm:w-48">
                    <div
                      key={loadCount}
                      className="bg-theme-accent h-full animate-[fill-bar_0.6s_linear_forwards]"
                    />
                  </div>
                  <span className="text-theme-accent/70 mt-3 font-mono text-[10px] tracking-widest uppercase sm:mt-4 sm:text-xs">
                    Initializing Module...
                  </span>
                </div>

                {HOW_IT_WORKS_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const visible = index === activeStep && !isLoading;
                  return (
                    <div
                      key={step.id}
                      aria-hidden={!visible}
                      inert={!visible}
                      className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:px-6 ${visible ? 'blur-0 scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0 blur-sm'}`}
                    >
                      <div className="border-theme-line bg-theme-surface relative mb-4 flex h-16 w-16 items-center justify-center rounded-full border shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] sm:mb-6 sm:h-24 sm:w-24">
                        <div className="border-theme-accent/30 absolute inset-1.5 animate-[spin_10s_linear_infinite] rounded-full border border-dashed motion-reduce:animate-none sm:inset-2" />
                        <Icon className="text-theme-accent-hover h-6 w-6 drop-shadow-[0_0_15px_var(--theme-accent)] sm:h-10 sm:w-10" />
                      </div>
                      <h3 className="text-theme-fg text-base font-bold sm:text-xl md:text-2xl">
                        {t(`howItWorks.steps.${step.id}.title`)}
                      </h3>
                      <p className="text-theme-muted mt-2 max-w-sm text-xs leading-relaxed sm:mt-3 sm:text-sm md:text-base">
                        {t(`howItWorks.steps.${step.id}.description`)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-theme-line bg-theme-surface relative z-10 flex flex-wrap items-center justify-between gap-3 border-t px-3 py-3 sm:px-6">
              <div className="text-theme-dim flex items-center gap-2 font-mono text-[10px]">
                <span className="bg-theme-accent h-1.5 w-1.5 animate-pulse rounded-full motion-reduce:animate-none" />{' '}
                SYSTEM ONLINE
              </div>
              <div className="flex items-center gap-3 sm:gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex w-8 flex-col items-center sm:w-14">
                    <Gauge className="text-theme-dim h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <div className="bg-theme-panel mt-1 h-1 w-full rounded-full">
                      <div
                        className="bg-theme-dim h-full rounded-full motion-reduce:animate-none!"
                        style={{ animation: `pulse-width ${3 + i}s ease-in-out infinite` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Frame>
        </div>

        <div className="mt-10 text-center sm:mt-16 lg:mt-20">
          <AppButton isLink linkTo={APP_LOGIN_URL} variant="primary" size="lg" className="mx-auto">
            {t('howItWorks.cta')}
          </AppButton>
        </div>
      </div>
    </Section>
  );
};
