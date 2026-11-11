import { cn } from '@/shared/lib';
import { ReactNode } from 'react';

interface ISectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  noBorder?: boolean;
  theme?: 'default' | 'careers' | 'blog';
}

export const Section = ({
                          id,
                          children,
                          className,
                          noBorder,
                          theme: _theme = 'default',
                        }: ISectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden bg-theme-bg py-16 text-theme-fg sm:py-24',
        !noBorder && 'border-t border-theme-line',
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

      <div className="pointer-events-none absolute top-1/2 left-1/2 h-150 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-theme-accent/5 blur-3xl" />

      {children}
    </section>
  );
};