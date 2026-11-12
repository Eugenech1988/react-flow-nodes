'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { TOTAL_STEPS, STARTUP_PROBES } from '../constants';
import { useMediaQuery, useThrottledScroll } from '@/shared/hooks';

const computeIndex = (el: HTMLElement): number => {
  const scrollableHeight = el.offsetHeight - window.innerHeight;
  if (scrollableHeight <= 0) return 0;
  const progress = Math.max(0, Math.min(1, (window.scrollY - el.offsetTop) / scrollableHeight));
  return Math.min(TOTAL_STEPS - 1, Math.max(0, Math.floor(progress * TOTAL_STEPS)));
};

export const useFeaturesScroll = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isDesktop) {
      setIndex(0);
      setReady(true);
      return;
    }

    let raf = 0;
    let cancelled = false;

    const startCheck = () => {
      if (cancelled) return;
      let attempts = 0;
      const check = () => {
        if (cancelled) return;
        const el = wrapperRef.current;
        if (el) setIndex(computeIndex(el));
        attempts++;
        if (attempts >= STARTUP_PROBES) {
          setReady(true);
          return;
        }
        raf = requestAnimationFrame(check);
      };
      raf = requestAnimationFrame(check);
    };

    startCheck();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [isDesktop]);

  const onScroll = useCallback(() => {
    if (!isDesktop || !ready) return;
    const el = wrapperRef.current;
    if (!el) return;
    const next = computeIndex(el);
    setIndex((prev) => (prev === next ? prev : next));
  }, [isDesktop, ready]);

  useThrottledScroll(onScroll);

  const goToStep = (stepIndex: number) => {
    if (!isDesktop) {
      setIndex(stepIndex);
      return;
    }

    const el = wrapperRef.current;
    if (!el) return;
    const scrollableHeight = el.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;
    const targetProgress = stepIndex / (TOTAL_STEPS - 1);
    window.scrollTo({
      top: el.offsetTop + targetProgress * scrollableHeight,
      behavior: 'smooth',
    });
  };

  return { wrapperRef, index, ready, isDesktop, goToStep };
};
