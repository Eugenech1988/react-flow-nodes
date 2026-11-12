import type { ReactNode } from 'react';
import { cn } from '@/shared/lib';
import { Rivets } from './Rivets';
import { themeScope, type TUiTheme } from './theme';

interface ITechCardProps {
  children: ReactNode;
  className?: string;
  popular?: boolean;
  rivets?: boolean;
  theme?: TUiTheme;
}

export const TechCard = ({
                           children,
                           className,
                           popular,
                           rivets = true,
                           theme,
                         }: ITechCardProps) => {
  const isCareers = theme === 'careers';
  const isBlog = theme === 'blog';
  const isDefault = !isCareers && !isBlog;

  return (
    <div
      {...themeScope(theme)}
      className={cn(
        'group relative flex flex-col overflow-hidden backdrop-blur-md transition-all duration-300',
        isCareers &&
        'border-theme-line/50 bg-theme-bg/80 shadow-theme-panel hover:border-theme-accent/50 hover:shadow-theme-glow rounded-2xl border hover:-translate-y-1',
        isBlog &&
        'border-theme-line bg-theme-surface shadow-theme-panel hover:border-theme-accent/60 hover:bg-theme-panel hover:shadow-theme-glow rounded-sm border hover:-translate-y-0.5',
        isDefault &&
        (popular
          ? 'border-theme-accent/60 from-theme-raised via-theme-surface to-theme-bg shadow-theme-glow-lg rounded-2xl border-2 bg-linear-to-br hover:-translate-y-1.5 md:-translate-y-4'
          : 'border-theme-accent/20 bg-theme-surface/80 shadow-theme-panel hover:border-theme-accent/50 hover:shadow-theme-glow rounded-2xl border hover:-translate-y-1.5'),
        className,
      )}
    >
      {rivets && <Rivets compact className="bg-theme-rivet" />}
      {children}
    </div>
  );
};