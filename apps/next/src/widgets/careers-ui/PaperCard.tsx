import type { ReactNode } from 'react';
import { cn } from '@/shared/lib';

export interface IPaperCardProps {
  children: ReactNode;
  className?: string;
  clipPath?: string;
  decor?: ReactNode;
}

export const PaperCard = ({ children, className, clipPath, decor }: IPaperCardProps) => (
  <div
    className={cn('relative overflow-hidden', className)}
    style={clipPath ? { clipPath } : undefined}
  >
    {children}
    {decor}
  </div>
);
