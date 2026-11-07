'use client';

import { useRef, useState, useEffect } from 'react';
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from 'framer-motion';
import { SectionHeading } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { FeaturePlaque, CtaPlaque } from './components';
import { FEATURES, SLIDE_VARIANTS } from './constants';

const totalSteps = FEATURES.length + 1;

export function FeaturesSection() {
  const { t } = useT('marketing');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(media.matches);

    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!isDesktop) return;

    const next = Math.min(totalSteps - 1, Math.max(0, Math.floor(v * totalSteps + 0.001)));
    if (next !== prevIndexRef.current) {
      setDirection(next > prevIndexRef.current ? 1 : -1);
      setIndex(next);
      prevIndexRef.current = next;
    }
  });

  const scrollToStep = (stepIndex: number) => {
    if (!isDesktop) {
      if (stepIndex === index) return;
      setDirection(stepIndex > index ? 1 : -1);
      setIndex(stepIndex);
      return;
    }

    const el = wrapperRef.current;
    if (!el) return;

    const scrollableHeight = el.offsetHeight - window.innerHeight;
    const targetProgress = stepIndex / (totalSteps - 1);
    const targetY = el.offsetTop + targetProgress * scrollableHeight;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  const slideVariantsResolved: Variants = prefersReducedMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : SLIDE_VARIANTS;

  return (
    <section
      id="features"
      ref={wrapperRef}
      className="relative w-full bg-[#040a09] lg:h-(--scroll-height)"
      style={{ '--scroll-height': `${totalSteps * 150}vh` } as React.CSSProperties}
    >
      <div className="relative flex min-h-dvh w-full flex-col overflow-hidden border-t border-[#2dd4bf]/20 pt-24 pb-16 text-[#d1faf5] lg:sticky lg:top-0 lg:h-dvh lg:justify-center lg:pt-32 lg:pb-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#5eead4_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.05]" />
        <div className="pointer-events-none absolute top-0 left-1/2 h-175 w-175 -translate-x-1/2 rounded-full bg-[#2dd4bf]/[0.07] blur-3xl" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col px-6">
          <SectionHeading
            gradientDirection="left"
            title={t('features.heading.title')}
            description={t('features.heading.description')}
          />

          <div className="relative grid w-full flex-1 place-items-center py-8 lg:py-6">
            <div className="relative grid min-h-95 w-full max-w-3xl place-items-center">
              <AnimatePresence mode="sync" initial={false} custom={direction}>
                <m.div
                  key={index}
                  custom={direction}
                  variants={slideVariantsResolved}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: prefersReducedMotion ? 0.2 : 0.55,
                    ease: [0.22, 1, 0.36, 1],
                    opacity: { duration: prefersReducedMotion ? 0.2 : 0.35 },
                  }}
                  className="col-start-1 row-start-1 flex w-full items-center justify-center"
                >
                  {index < FEATURES.length ? (
                    <FeaturePlaque
                      title={t(`features.list.${FEATURES[index].id}.title`)}
                      badge={t(`features.list.${FEATURES[index].id}.badge`)}
                      description={t(`features.list.${FEATURES[index].id}.description`)}
                      Icon={FEATURES[index].icon}
                      number={String(index + 1).padStart(2, '0')}
                    />
                  ) : (
                    <CtaPlaque />
                  )}
                </m.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mx-auto w-full max-w-2xl pb-4 sm:pb-12">
            <div className="flex items-center justify-between gap-1.5 sm:gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => {
                const isActive = i === index;
                const isPassed = i < index;

                return (
                  <div key={`step-${i}`} className="flex flex-1 items-center gap-1.5 sm:gap-2">
                    <m.button
                      type="button"
                      onClick={() => scrollToStep(i)}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        borderColor: isActive
                          ? 'rgba(94,234,212,1)'
                          : isPassed
                            ? 'rgba(45,212,191,0.6)'
                            : 'rgba(45,212,191,0.2)',
                        backgroundColor: isActive
                          ? 'rgba(45,212,191,0.2)'
                          : isPassed
                            ? 'rgba(45,212,191,0.1)'
                            : 'rgba(45,212,191,0)',
                        color: isActive
                          ? '#5eead4'
                          : isPassed
                            ? '#2dd4bf'
                            : 'rgba(141,184,180,0.5)',
                        boxShadow: isActive
                          ? '0 0 12px rgba(45,212,191,0.5)'
                          : '0 0 0px rgba(45,212,191,0)',
                      }}
                      whileHover={{
                        scale: 1.15,
                        borderColor: 'rgba(94,234,212,0.8)',
                        backgroundColor: 'rgba(45,212,191,0.15)',
                        color: '#5eead4',
                        boxShadow: '0 0 12px rgba(45,212,191,0.3)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 font-mono text-[9px] font-bold outline-none sm:h-8 sm:w-8 sm:text-[10px]"
                      aria-label={`Go to step ${i + 1}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </m.button>
                    {i < totalSteps - 1 && (
                      <div className="relative h-px flex-1 overflow-hidden bg-[#2dd4bf]/15">
                        <m.div
                          initial={false}
                          animate={{ width: isPassed ? '100%' : '0%' }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className="absolute inset-y-0 left-0 bg-[#2dd4bf]"
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
