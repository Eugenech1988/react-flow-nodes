import { cn } from '@/shared/lib';

interface ITechLabelProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'default' | 'careers' | 'blog';
}

export const TechLabel = ({ children, className, theme: _theme = 'default' }: ITechLabelProps) => {
  return (
    <span
      className={cn('font-mono text-[10px] tracking-widest text-theme-accent/70 uppercase', className)}
    >
      {children}
    </span>
  );
};