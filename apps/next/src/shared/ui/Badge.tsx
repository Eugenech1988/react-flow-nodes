import type { ReactNode } from 'react';
import { cn } from '@/shared/lib';

export type TBadgeVariant = 'hex' | 'pill';
export type TBadgeTheme = 'default' | 'careers' | 'blog';

export interface IBadgeProps {
  children: ReactNode;
  variant: TBadgeVariant;
  className?: string;
  theme?: TBadgeTheme;
}

const HEX_CLIP =
  '[clip-path:polygon(6px_0,calc(100%-6px)_0,100%_50%,calc(100%-6px)_100%,6px_100%,0_50%)]';

const HEX_BORDER: Record<TBadgeTheme, string> = {
  default: 'bg-[#2dd4bf]/30',
  careers: 'bg-careers-accent/40',
  blog: 'bg-blog-accent/40',
};

const HEX_INNER: Record<TBadgeTheme, string> = {
  default: 'bg-[#0a1615] text-[#2dd4bf]',
  careers: 'bg-careers-surface text-careers-accent',
  blog: 'bg-blog-surface text-blog-accent-hover',
};

const HexBadge = ({
                    children,
                    className,
                    theme,
                  }: {
  children: ReactNode;
  className?: string;
  theme: TBadgeTheme;
}) => (
  <div className={cn('relative shrink-0 p-px', HEX_CLIP, HEX_BORDER[theme], className)}>
    <div
      className={cn(
        'flex items-center justify-center px-4 py-1 font-mono text-[10px] tracking-widest uppercase',
        HEX_CLIP,
        HEX_INNER[theme],
      )}
    >
      {children}
    </div>
  </div>
);

const PillBadge = ({
                     children,
                     className,
                     theme,
                   }: {
  children: ReactNode;
  className?: string;
  theme: TBadgeTheme;
}) => {
  const isCareers = theme === 'careers';
  const isBlog = theme === 'blog';
  const isThemed = isCareers || isBlog;

  const accent = isCareers ? '#6fa28c' : isBlog ? '#9cc4b0' : '#39b39b';
  const accentGlow = isCareers
    ? 'rgba(111,162,140,1)'
    : isBlog
      ? 'rgba(156,196,176,1)'
      : 'rgba(57,179,155,1)';

  return (
    <div
      className={cn(
        'relative flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white/5 px-5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md',
        isCareers && 'rounded-sm border-[#6fa28c]/40 bg-[#0a0e0d]/80',
        isBlog && 'rounded-sm border-[#6fa28c]/40 bg-[#071316]/80',
        !isThemed && 'border-teal-500/30',
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${accentGlow.replace('1)', '0.15)')}, transparent 60%)`,
        }}
      />
      <span
        className={cn(
          'pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent to-transparent',
          isCareers && 'via-[#6fa28c]/40',
          isBlog && 'via-[#9cc4b0]/40',
          !isThemed && 'via-teal-300/40',
        )}
      />
      <span
        className={cn(
          'pointer-events-none absolute inset-x-3 bottom-0 h-px bg-linear-to-r from-transparent to-transparent',
          isCareers && 'via-[#6fa28c]/20',
          isBlog && 'via-[#9cc4b0]/20',
          !isThemed && 'via-teal-400/20',
        )}
      />

      {[
        'top-1.25 left-1.25',
        'top-1.25 right-1.25',
        'bottom-1.25 left-1.25',
        'bottom-1.25 right-1.25',
      ].map((pos) => (
        <span
          key={pos}
          className={cn(
            'pointer-events-none absolute z-10 h-1 w-1 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.8)]',
            pos,
          )}
          style={{
            background: `radial-gradient(circle at 30% 30%, #ffffff, ${accent} 35%, ${accent}55 70%, #000000 100%)`,
          }}
        />
      ))}

      <div className="relative z-20 flex items-center gap-3 px-1">
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ backgroundColor: accent }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accentGlow}` }}
          />
        </span>

        <span
          className={cn('text-[10px] font-bold tracking-[0.15em] uppercase', {
            'text-teal-300/90 drop-shadow-[0_0_4px_rgba(57,179,155,0.4)]': !isThemed,
            'font-typewriter text-[#9cc4b0] drop-shadow-[0_0_4px_rgba(111,162,140,0.4)]': isCareers,
            'font-typewriter text-[#d4ccb8] drop-shadow-[0_0_4px_rgba(212,204,184,0.4)]': isBlog,
          })}
        >
          {children}
        </span>

        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ backgroundColor: accent }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accentGlow}` }}
          />
        </span>
      </div>
    </div>
  );
};

export const Badge = ({ children, className, theme = 'default', variant }: IBadgeProps) =>
  variant === 'pill' ? (
    <PillBadge className={className} theme={theme}>
      {children}
    </PillBadge>
  ) : (
    <HexBadge className={className} theme={theme}>
      {children}
    </HexBadge>
  );