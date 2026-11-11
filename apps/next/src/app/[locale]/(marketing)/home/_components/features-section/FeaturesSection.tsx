'use client';

import { SectionHeading, Rivets } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { FeaturePlaque, CtaPlaque, BackgroundArtifacts } from './components';
import { SLIDES, TOTAL_STEPS } from './constants';
import { useFeaturesScroll } from './hooks';

export const FeaturesSection = () => {
  const { t } = useT('marketing');
  const { wrapperRef, index, ready, goToStep } = useFeaturesScroll();

  return (
    <section
      id="features"
      ref={wrapperRef}
      className="relative w-full bg-theme-bg lg:h-(--scroll-height)"
      style={{ '--scroll-height': `${TOTAL_STEPS * 150}vh` } as React.CSSProperties}
    >
      <div className="relative flex w-full flex-col overflow-hidden border-t border-theme-accent/20 py-16 text-theme-fg sm:py-24 lg:sticky lg:top-0 lg:h-dvh lg:min-h-dvh lg:justify-center lg:py-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--theme-accent-hover)_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.05]" />

        <div className="pointer-events-none absolute top-0 left-1/2 h-175 w-175 -translate-x-1/2 rounded-full bg-theme-accent/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-100 w-150 -translate-x-1/2 rounded-full bg-theme-accent/[0.04] blur-3xl" />

        <BackgroundArtifacts />

        <Rivets className="bg-theme-accent/30 sm:h-2.5 sm:w-2.5" />

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col px-4 sm:px-6">
          <SectionHeading
            gradientDirection="left"
            title={t('features.heading.title')}
            description={t('features.heading.description')}
          />

          <div
            className={`relative mt-8 grid w-full place-items-center sm:mt-12 lg:mt-12 ${
              !ready ? 'lg:opacity-0' : 'opacity-100'
            }`}
          >
            <div className="grid w-full max-w-3xl">
              {SLIDES.map((slide, i) => {
                const isActive = i === index;
                const isPast = i < index;

                return (
                  <div
                    key={i}
                    aria-hidden={!isActive}
                    inert={!isActive}
                    className={`col-start-1 row-start-1 flex items-center justify-center transition-all duration-500 motion-reduce:transition-none ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? 'blur-0 z-10 translate-y-0 scale-100 opacity-100'
                        : isPast
                          ? 'pointer-events-none z-0 -translate-y-30 scale-95 opacity-0 blur-sm'
                          : 'pointer-events-none z-0 translate-y-30 scale-95 opacity-0 blur-sm'
                    }`}
                  >
                    {slide.kind === 'feature' ? (
                      <FeaturePlaque
                        title={t(`features.list.${slide.id}.title`)}
                        badge={t(`features.list.${slide.id}.badge`)}
                        description={t(`features.list.${slide.id}.description`)}
                        Icon={slide.icon}
                        number={String(i + 1).padStart(2, '0')}
                      />
                    ) : (
                      <CtaPlaque />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mx-auto mt-10 w-full max-w-2xl sm:mt-14 lg:mt-16">
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                const isActive = i === index;
                const isPassed = i < index;

                return (
                  <div key={`step-${i}`} className="flex flex-1 items-center gap-1 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => goToStep(i)}
                      className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold transition-all duration-300 ease-out outline-none motion-reduce:transition-none hover:scale-110 active:scale-95 sm:h-10 sm:w-10 sm:text-xs ${
                        isActive
                          ? 'scale-110 border-theme-accent-hover bg-theme-accent/20 text-theme-accent-hover shadow-[0_0_15px_var(--theme-accent)]'
                          : isPassed
                            ? 'border-theme-accent/60 bg-theme-accent/10 text-theme-accent'
                            : 'border-theme-accent/20 bg-transparent text-theme-accent/50 hover:border-theme-accent-hover/80 hover:bg-theme-accent/15 hover:text-theme-accent-hover'
                      }`}
                      aria-label={t('features.stepLabel', { defaultValue: 'Go to step {{n}}', n: i + 1 })}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </button>

                    {i < TOTAL_STEPS - 1 && (
                      <div className="relative h-0.5 flex-1 overflow-hidden bg-theme-accent/15">
                        <div
                          className="absolute inset-y-0 left-0 bg-theme-accent transition-[width] duration-300 ease-out"
                          style={{ width: isPassed ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};