import { cn } from '@/shared/lib';
import type { ReactNode } from 'react';

interface ISectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  noBorder?: boolean;
}

export const Section = ({ id, children, className, noBorder }: ISectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        'bg-theme-bg text-theme-fg relative overflow-hidden py-16 sm:py-24',
        !noBorder && 'border-theme-line border-t',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-size-[22px_22px] opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--theme-accent) 1px, transparent 0)',
        }}
      />

      <div className="bg-theme-accent/5 pointer-events-none absolute top-1/2 left-1/2 h-150 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      {children}
    </section>
  );
};
