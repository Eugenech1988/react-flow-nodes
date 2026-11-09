import { cn } from '@/shared/lib';

export const TechLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn('font-mono text-[10px] tracking-widest text-[#2dd4bf]/70 uppercase', className)}
  >
    {children}
  </span>
);
