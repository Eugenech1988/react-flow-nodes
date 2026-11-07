'use client';

import { m } from 'framer-motion';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const REPEATS = 3;

function OdometerDigit({ value, delay }: { value: number; delay: number }) {
  const targetDigitIndex = REPEATS * 10 + value;
  const totalDigits = targetDigitIndex + 1;
  const targetY = -(targetDigitIndex / totalDigits) * 100;

  return (
    <span className="relative mx-0.5 inline-flex h-[1.15em] w-[0.7em] shrink-0 items-center justify-center rounded-sm bg-[#3a4842] p-px shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
      <span className="relative flex h-full w-full overflow-hidden rounded-[3px] bg-linear-to-b from-[#0a0e0d] via-[#1a2420] to-[#0a0e0d] shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),inset_0_-2px_6px_rgba(0,0,0,0.9)]">
        <m.span
          initial={{ y: '0%' }}
          whileInView={{ y: `${targetY}%` }}
          viewport={{ once: true, margin: '0px 0px -20px 0px' }}
          transition={{
            duration: 1.8 + delay,
            ease: [0.16, 1, 0.3, 1],
            delay: delay,
          }}
          className="absolute top-0 left-0 flex w-full flex-col items-center"
        >
          {Array.from({ length: REPEATS }).map((_, repIndex) =>
            DIGITS.map((digit) => (
              <span
                key={`${repIndex}-${digit}`}
                className="flex h-[1.15em] w-full items-center justify-center font-serif leading-none font-bold text-[#9cc4b0]"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(156,196,176,0.3)' }}
              >
                {digit}
              </span>
            )),
          )}
          {DIGITS.slice(0, value + 1).map((digit, index) => (
            <span
              key={`final-${digit}-${index}`}
              className="flex h-[1.15em] w-full items-center justify-center font-serif leading-none font-bold text-[#9cc4b0]"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(156,196,176,0.3)' }}
            >
              {digit}
            </span>
          ))}
        </m.span>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-white/10 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/40" />
      </span>
    </span>
  );
}

export function Odometer({ value }: { value: string }) {
  const chars = String(value).split('');

  return (
    <div className="flex items-center">
      {chars.map((char, index) => {
        if (isNaN(parseInt(char, 10))) {
          return (
            <span key={index} className="mx-1 font-serif text-3xl font-bold text-[#9cc4b0]">
              {char}
            </span>
          );
        }

        return <OdometerDigit key={index} value={parseInt(char, 10)} delay={index * 0.15} />;
      })}
    </div>
  );
}
