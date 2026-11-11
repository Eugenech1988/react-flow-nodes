import { ReactNode } from 'react';
import { cn } from '@/shared/lib';
import { Rivets } from './Rivets';

interface ITechCardProps {
  children: ReactNode;
  className?: string;
  popular?: boolean;
  rivets?: boolean;
  theme?: 'default' | 'careers' | 'blog';
}

export const TechCard = ({
                           children,
                           className,
                           popular,
                           rivets = true,
                           theme = 'default',
                         }: ITechCardProps) => {
  const isCareers = theme === 'careers';
  const isBlog = theme === 'blog';

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden backdrop-blur-md transition-all duration-300',
        isCareers &&
        'rounded-2xl border border-theme-line/50 bg-theme-bg/80 shadow-theme-panel hover:-translate-y-1 hover:border-theme-accent/50 hover:shadow-theme-glow',
        isBlog &&
        'rounded-sm border border-theme-line bg-theme-surface shadow-theme-panel hover:-translate-y-0.5 hover:border-theme-accent/60 hover:bg-theme-panel hover:shadow-theme-glow',
        !isCareers &&
        !isBlog &&
        (popular
          ? 'rounded-2xl border-2 border-theme-accent/60 bg-linear-to-br from-theme-raised via-theme-surface to-theme-bg shadow-theme-glow-lg hover:-translate-y-1.5 md:-translate-y-4'
          : 'rounded-2xl border border-theme-accent/20 bg-theme-surface/80 shadow-theme-panel hover:-translate-y-1.5 hover:border-theme-accent/50 hover:shadow-theme-glow'),
        className,
      )}
    >
      {rivets && <Rivets compact className="bg-theme-rivet" />}
      {children}
    </div>
  );
};