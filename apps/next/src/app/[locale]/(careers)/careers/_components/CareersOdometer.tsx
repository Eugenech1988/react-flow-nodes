'use client';

import { useRef, useLayoutEffect, useState } from 'react';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const REPEATS = 3;

interface IOdometerDigitProps {
  value: number;
  isActive: boolean;
}

const OdometerDigit = ({ value, isActive }: IOdometerDigitProps) => {
  const targetDigitIndex = REPEATS * 10 + value;
  const totalDigits = targetDigitIndex + 1;
  const targetY = -(targetDigitIndex / totalDigits) * 100;

  const digitClass =
    'text-theme-accent-hover flex h-[1.15em] w-full items-center justify-center font-serif leading-none font-bold';
  const digitStyle = {
    textShadow:
      '0 1px 2px rgba(0,0,0,0.8), 0 0 4px color-mix(in oklab, var(--theme-accent-hover) 30%, transparent)',
  };

  return (
    <span className="bg-theme-rivet relative mx-0.5 inline-flex h-[1.15em] w-[0.7em] shrink-0 items-center justify-center rounded-sm p-px shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
      <span className="from-theme-bg via-theme-surface to-theme-bg relative flex h-full w-full overflow-hidden rounded-[3px] bg-linear-to-b shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),inset_0_-2px_6px_rgba(0,0,0,0.9)]">
        <div
          className="absolute top-0 left-0 flex w-full flex-col items-center"
          style={{
            transform: `translateY(${isActive ? targetY : 0}%)`,
            transition: 'transform 6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {Array.from({ length: REPEATS }).map((_, repIndex) =>
            DIGITS.map((digit) => (
              <span key={`${repIndex}-${digit}`} className={digitClass} style={digitStyle}>
                {digit}
              </span>
            )),
          )}
          {DIGITS.slice(0, value + 1).map((digit, index) => (
            <span key={`final-${digit}-${index}`} className={digitClass} style={digitStyle}>
              {digit}
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-white/10 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/40" />
      </span>
    </span>
  );
};

export const Odometer = ({ value }: { value: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top < vh + 400 && rect.bottom > -400) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px 400px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const chars = String(value).split('');

  return (
    <div ref={ref} className="flex items-center" role="img" aria-label={value}>
      {chars.map((char, index) => {
        if (Number.isNaN(parseInt(char, 10))) {
          return (
            <span
              key={index}
              aria-hidden="true"
              className="text-theme-accent-hover mx-1 font-serif text-3xl font-bold"
            >
              {char}
            </span>
          );
        }

        return (
          <span key={index} aria-hidden="true">
            <OdometerDigit value={parseInt(char, 10)} isActive={inView} />
          </span>
        );
      })}
    </div>
  );
};
