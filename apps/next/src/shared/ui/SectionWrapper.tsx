import { cn } from '@/shared/lib';
import { ReactNode } from 'react';

interface ISectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  noBorder?: boolean;
}

export const Section = ({ id, children, className, noBorder }: ISectionProps) => (
  <section
    id={id}
    className={cn(
      'relative overflow-hidden bg-[#040a09] py-16 text-[#d1faf5] sm:py-24',
      !noBorder && 'border-t border-[#2dd4bf]/10',
      className,
    )}
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#5eead4_1px,transparent_0)] bg-size-[22px_22px] opacity-[0.03]" />

    <div className="pointer-events-none absolute top-1/2 left-1/2 h-150 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2dd4bf]/5 blur-3xl" />

    {/* Опционально: огромные иконки на фоне */}
    {/* Их можно передавать через пропс, например <SectionDecorations icons={[Network, Factory]} /> */}

    {children}
  </section>
);
