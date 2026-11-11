import { cn } from '@/shared/lib';

interface ITechLabelProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'default' | 'careers' | 'blog';
}

export const TechLabel = ({ children, className, theme = 'default' }: ITechLabelProps) => {
  const colorClass =
    theme === 'careers'
      ? 'text-[#6fa28c]/70'
      : theme === 'blog'
        ? 'text-[#6fa28c]/70'
        : 'text-[#2dd4bf]/70';

  return (
    <span className={cn('font-mono text-[10px] tracking-widest uppercase', colorClass, className)}>
      {children}
    </span>
  );
};