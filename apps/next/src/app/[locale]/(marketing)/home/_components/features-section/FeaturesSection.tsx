'use client';

import { SectionHeading } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { FeaturePlaque, CtaPlaque, BackgroundArtifacts } from './components';
import { SLIDES, TOTAL_STEPS } from './model';
import { useFeaturesScroll } from './hooks';

export function FeaturesSection() {
  const { t } = useT('marketing');
  const { wrapperRef, index, ready, goToStep } = useFeaturesScroll();

  return (
    <section
      id="features"
      ref={wrapperRef}
      className="relative w-full bg-[#040a09] lg:h-(--scroll-height)"
      style={{ '--scroll-height': `${TOTAL_STEPS * 150}vh` } as React.CSSProperties}
    >
      <div className="relative flex min-h-dvh w-full flex-col overflow-hidden border-t border-[#2dd4bf]/20 pt-24 pb-16 text-[#d1faf5] lg:sticky lg:top-0 lg:h-dvh lg:justify-center lg:pt-32 lg:pb-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#5eead4_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.05]" />
        <div className="pointer-events-none absolute top-0 left-1/2 h-175 w-175 -translate-x-1/2 rounded-full bg-[#2dd4bf]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-100 w-150 -translate-x-1/2 rounded-full bg-[#2dd4bf]/4 blur-3xl" />

        <BackgroundArtifacts />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col px-6">
          <SectionHeading
            gradientDirection="left"
            title={t('features.heading.title')}
            description={t('features.heading.description')}
          />

          <div
            className={`relative grid w-full flex-1 place-items-center py-8 lg:py-6 ${
              !ready ? 'lg:opacity-0' : 'opacity-100'
            }`}
          >
            <div className="relative min-h-95 w-full max-w-3xl">
              {SLIDES.map((slide, i) => {
                const isActive = i === index;
                const isPast = i < index;

                return (
                  <div
                    key={i}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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

          <div className="mx-auto w-full max-w-2xl pb-4 sm:pb-12">
            <div className="flex items-center justify-between gap-1.5 sm:gap-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                const isActive = i === index;
                const isPassed = i < index;

                return (
                  <div key={`step-${i}`} className="flex flex-1 items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => goToStep(i)}
                      className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 font-mono text-[9px] font-bold transition-all duration-300 ease-out outline-none hover:scale-110 active:scale-95 sm:h-8 sm:w-8 sm:text-[10px] ${
                        isActive
                          ? 'scale-110 border-[#5eead4] bg-[#2dd4bf]/20 text-[#5eead4] shadow-[0_0_12px_rgba(45,212,191,0.5)]'
                          : isPassed
                            ? 'border-[#2dd4bf]/60 bg-[#2dd4bf]/10 text-[#2dd4bf]'
                            : 'border-[#2dd4bf]/20 bg-transparent text-[#2dd4bf]/50 hover:border-[#5eead4]/80 hover:bg-[#2dd4bf]/15 hover:text-[#5eead4]'
                      }`}
                      aria-label={`Go to step ${i + 1}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </button>

                    {i < TOTAL_STEPS - 1 && (
                      <div className="relative h-px flex-1 overflow-hidden bg-[#2dd4bf]/15">
                        <div
                          className="absolute inset-y-0 left-0 bg-[#2dd4bf] transition-[width] duration-300 ease-out"
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
}
