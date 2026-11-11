import { cn } from '@/shared/lib';

export interface ICutoutBadgeProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'default' | 'careers' | 'blog';
}

export const CutoutBadge = ({ children, className, theme = 'default' }: ICutoutBadgeProps) => {
  const borderColor =
    theme === 'careers'
      ? 'bg-careers-accent/40'
      : theme === 'blog'
        ? 'bg-blog-accent/40'
        : 'bg-[#2dd4bf]/30';

  const innerBg =
    theme === 'careers'
      ? 'bg-careers-surface text-careers-accent'
      : theme === 'blog'
        ? 'bg-blog-surface text-blog-accent-hover'
        : 'bg-[#0a1615] text-[#2dd4bf]';

  return (
    <div
      className={cn(
        'relative shrink-0 p-px [clip-path:polygon(6px_0,calc(100%-6px)_0,100%_50%,calc(100%-6px)_100%,6px_100%,0_50%)]',
        borderColor,
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center px-4 py-1 font-mono text-[10px] tracking-widest uppercase [clip-path:polygon(6px_0,calc(100%-6px)_0,100%_50%,calc(100%-6px)_100%,6px_100%,0_50%)]',
          innerBg,
        )}
      >
        {children}
      </div>
    </div>
  );
};