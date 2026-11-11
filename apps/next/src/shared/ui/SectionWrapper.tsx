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
                          theme = 'default',
                        }: ISectionProps) => {
  const isCareers = theme === 'careers';
  const isBlog = theme === 'blog';

  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden py-16 text-[#d1faf5] sm:py-24',
        isCareers && 'bg-[#0a0e0d] text-[#d4cfc0]',
        isBlog && 'bg-[#071316] text-[#d4cfc0]',
        !isCareers && !isBlog && 'bg-[#040a09]',
        !noBorder &&
        (isCareers
          ? 'border-t border-[#2f3d36]'
          : isBlog
            ? 'border-t border-[#2f3d36]'
            : 'border-t border-[#2dd4bf]/10'),
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-size-[22px_22px] opacity-[0.03]',
          isBlog && 'opacity-[0.05]',
        )}
        style={{
          backgroundImage: isCareers
            ? 'radial-gradient(circle at 1px 1px, #6fa28c 1px, transparent 0)'
            : isBlog
              ? 'radial-gradient(circle at 1px 1px, #6fa28c 1px, transparent 0)'
              : 'radial-gradient(circle at 1px 1px, #5eead4 1px, transparent 0)',
        }}
      />

      <div
        className={cn(
          'pointer-events-none absolute top-1/2 left-1/2 h-150 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl',
          isCareers && 'bg-[#6fa28c]/5',
          isBlog && 'bg-[#6fa28c]/5',
          !isCareers && !isBlog && 'bg-[#2dd4bf]/5',
        )}
      />

      {children}
    </section>
  );
};