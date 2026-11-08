'use client';

import { useRef, useState, useEffect } from 'react';
import { TOTAL_STEPS } from '../constants';

const computeIndex = (el: HTMLElement): number => {
  const scrollableHeight = el.offsetHeight - window.innerHeight;
  if (scrollableHeight <= 0) return 0;
  const progress = Math.max(0, Math.min(1, (window.scrollY - el.offsetTop) / scrollableHeight));
  return Math.min(TOTAL_STEPS - 1, Math.max(0, Math.floor(progress * TOTAL_STEPS + 0.001)));
};

export function useFeaturesScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const desktop = media.matches;
    setIsDesktop(desktop);

    if (!desktop) {
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
        if (attempts >= 5) {
          setReady(true);
          return;
        }
        raf = requestAnimationFrame(check);
      };
      raf = requestAnimationFrame(check);
    };

    if (document.readyState === 'complete') {
      startCheck();
    } else {
      const onLoad = () => startCheck();
      window.addEventListener('load', onLoad, { once: true });
      return () => {
        cancelled = true;
        window.removeEventListener('load', onLoad);
        cancelAnimationFrame(raf);
      };
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || !ready) return;

    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const next = computeIndex(el);
      setIndex((prev) => (prev === next ? prev : next));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDesktop, ready]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (!e.matches) {
        setIndex(0);
        setReady(true);
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

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
}
