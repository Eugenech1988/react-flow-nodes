import { ReactNode } from 'react';
import { cn } from '@/shared/lib';
import { Rivets } from './rivets';

interface ITechCardProps {
  children: ReactNode;
  className?: string;
  popular?: boolean;
  rivets?: boolean;
}

export const TechCard = ({ children, className, popular, rivets = true }: ITechCardProps) => (
  <div
    className={cn(
      'group relative flex flex-col overflow-hidden rounded-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#2dd4bf]/50 hover:shadow-[0_15px_40px_rgba(45,212,191,0.15)]',
      popular
        ? 'border-2 border-[#2dd4bf]/60 bg-linear-to-br from-[#0d1f1e] via-[#0a1615] to-[#06100f] shadow-[0_0_40px_rgba(45,212,191,0.15)] md:-translate-y-4'
        : 'border border-[#2dd4bf]/20 bg-[#0d1f1e]/80 shadow-[inset_0_1px_0_rgba(45,212,191,0.1),0_10px_30px_rgba(0,0,0,0.5)]',
      className,
    )}
  >
    {rivets && <Rivets compact className="bg-[#2dd4bf]/40" />}
    {children}
  </div>
);
