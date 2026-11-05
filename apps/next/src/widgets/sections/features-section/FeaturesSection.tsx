'use client';

import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { SectionHeading } from '@/shared/ui';
import { FEATURES, SLIDE_VARIANTS } from './model';

const totalSteps = FEATURES.length + 1;

interface PlaqueProps {
  title: string;
  badge: string;
  description: string;
  Icon: LucideIcon;
  number: string;
}

function FeaturePlaque({ title, badge, description, Icon, number }: PlaqueProps) {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-[#2dd4bf]/40 bg-linear-to-br from-[#0d1f1e] via-[#0a1615] to-[#06100f] p-6 shadow-[inset_0_1px_0_rgba(45,212,191,0.12),0_8px_24px_rgba(0,0,0,0.5)] sm:p-8">
      <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />
      <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />
      <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />
      <span className="absolute right-3 bottom-3 h-1.5 w-1.5 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />

      <div className="mb-5 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#2dd4bf]/70 bg-linear-to-br from-[#123332] to-[#06100f] shadow-[inset_0_1px_0_rgba(94,234,212,0.25),0_0_15px_rgba(45,212,191,0.2)] sm:h-16 sm:w-16">
            <div className="absolute inset-1 rounded-full border border-[#2dd4bf]/30" />
            <Icon className="h-6 w-6 text-[#5eead4] drop-shadow-[0_0_5px_rgba(45,212,191,0.7)] sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[9px] tracking-[0.3em] text-[#2dd4bf]/60 uppercase sm:text-[10px]">
              № {number}
            </div>
            <h3 className="text-lg font-bold text-[#d1faf5] sm:text-xl md:text-2xl">{title}</h3>
          </div>
        </div>

        <div className="relative shrink-0 bg-[#2dd4bf]/40 p-px shadow-[0_4px_12px_rgba(0,0,0,0.5)] [clip-path:polygon(8px_0,calc(100%-8px)_0,100%_50%,calc(100%-8px)_100%,8px_100%,0_50%)]">
          <div className="relative flex items-center justify-center gap-2 bg-[#0a1615] px-6 py-1.5 font-mono text-[10px] tracking-[0.15em] text-[#5eead4] uppercase [clip-path:polygon(8px_0,calc(100%-8px)_0,100%_50%,calc(100%-8px)_100%,8px_100%,0_50%)]">
            <span className="absolute top-1/2 left-2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_0_1px_rgba(0,0,0,0.8)]" />
            <span className="absolute top-1/2 right-2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#2dd4bf]/40 shadow-[inset_0_0_1px_rgba(0,0,0,0.8)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#2dd4bf] shadow-[0_0_5px_#2dd4bf]" />
            <span className="h-3 w-px bg-[#2dd4bf]/30" />
            {badge}
          </div>
        </div>
      </div>

      <p
        className="text-sm leading-relaxed text-[#8db8b4] sm:text-base"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}

function CtaPlaque() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-3xl border-2 border-[#2dd4bf]/50 bg-linear-to-r from-[#0d2422] via-[#0a1615] to-[#0a1615] p-6 shadow-[inset_0_1px_0_rgba(45,212,191,0.15),0_12px_40px_rgba(0,0,0,0.7)] sm:p-8">
      <span className="absolute top-3 left-3 h-2 w-2 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_3px_rgba(0,0,0,0.6)]" />
      <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_3px_rgba(0,0,0,0.6)]" />
      <span className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_3px_rgba(0,0,0,0.6)]" />
      <span className="absolute right-3 bottom-3 h-2 w-2 rounded-full bg-linear-to-br from-[#5eead4] to-[#2dd4bf] shadow-[inset_0_0_3px_rgba(0,0,0,0.6)]" />

      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-2 font-mono text-[10px] tracking-[0.3em] text-[#2dd4bf]/70 uppercase">
            Assembly Instructions
          </div>
          <h3 className="text-xl font-bold text-[#d1faf5] sm:text-2xl">
            Ready to fire up your first pipeline?
          </h3>
          <p className="mt-2 text-sm text-[#8db8b4] sm:text-base">
            Combine inputs, actions, and custom webhooks inside a secure browser-based engine room.
          </p>
        </div>
        <a
          href="#"
          className="group inline-flex items-center justify-center gap-2 justify-self-start rounded-xl border border-[#2dd4bf]/50 bg-linear-to-b from-[#123332] to-[#06100f] px-6 py-3 font-mono text-xs font-bold tracking-[0.15em] text-[#5eead4] uppercase shadow-[inset_0_1px_0_rgba(45,212,191,0.3),0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:border-[#5eead4] hover:shadow-[inset_0_1px_0_rgba(45,212,191,0.5),0_0_20px_rgba(45,212,191,0.35)] md:justify-self-end"
        >
          Open Studio
          <span className="transition-transform group-hover:translate-x-1">➔</span>
        </a>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(totalSteps - 1, Math.max(0, Math.floor(v * totalSteps + 0.001)));
    if (next !== prevIndexRef.current) {
      setDirection(next > prevIndexRef.current ? 1 : -1);
      setIndex(next);
      prevIndexRef.current = next;
    }
  });

  const scrollToStep = (stepIndex: number) => {
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
      ref={wrapperRef}
      className="relative bg-[#040a09]"
      style={{ height: `${totalSteps * 150}vh` }}
    >
      <div className="sticky top-0 flex h-dvh w-full flex-col overflow-hidden border-t border-[#2dd4bf]/20 pt-32 text-[#d1faf5]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#5eead4_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.05]" />
        <div className="pointer-events-none absolute top-0 left-1/2 h-175 w-175 -translate-x-1/2 rounded-full bg-[#2dd4bf]/[0.07] blur-3xl" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col px-6">
          <SectionHeading
            title="Powering Your Workflows"
            description="Six precision-engineered mechanisms, machined for the modern automation workshop."
          />

          <div className="relative flex min-h-0 w-full flex-1 items-center justify-center py-6">
            <div className="relative h-full w-full max-w-3xl">
              <AnimatePresence mode="sync" initial={false} custom={direction}>
                <motion.div
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
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {index < FEATURES.length ? (
                    <FeaturePlaque
                      title={FEATURES[index].title}
                      badge={FEATURES[index].badge}
                      description={FEATURES[index].description}
                      Icon={FEATURES[index].icon}
                      number={String(index + 1).padStart(2, '0')}
                    />
                  ) : (
                    <CtaPlaque />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mx-auto w-full max-w-2xl pb-10 sm:pb-12">
            <div className="flex items-center justify-between gap-1.5 sm:gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => {
                const isActive = i === index;
                const isPassed = i < index;
                const isLast = i === FEATURES.length;

                return (
                  <div
                    key={isLast ? 'cta-step' : FEATURES[i].title}
                    className="flex flex-1 items-center gap-1.5 sm:gap-2"
                  >
                    <motion.button
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
                    </motion.button>
                    {i < totalSteps - 1 && (
                      <div className="relative h-px flex-1 overflow-hidden bg-[#2dd4bf]/15">
                        <motion.div
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
