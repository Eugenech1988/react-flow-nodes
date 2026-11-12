import { cn } from '@/shared/lib';

interface ITechLabelProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'default' | 'careers' | 'blog';
}

export const TechLabel = ({ children, className, theme: _theme = 'default' }: ITechLabelProps) => {
  return (
    <span
      className={cn(
        'text-theme-accent/70 font-mono text-[10px] tracking-widest uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
};
