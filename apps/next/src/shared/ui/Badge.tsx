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
  default: 'bg-theme-accent/30',
  careers: 'bg-theme-accent/40',
  blog: 'bg-theme-accent/40',
};

const HEX_INNER: Record<TBadgeTheme, string> = {
  default: 'bg-theme-panel text-theme-accent',
  careers: 'bg-theme-surface text-theme-accent',
  blog: 'bg-theme-surface text-theme-accent-hover',
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

  return (
    <div
      className={cn(
        'relative flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-md border border-theme-accent/30 bg-theme-fg/5 px-5 py-2 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-fg)_10%,transparent),inset_0_-1px_2px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md',
        isCareers && 'rounded-sm border-theme-accent/40 bg-theme-bg/80',
        isBlog && 'rounded-sm border-theme-accent/40 bg-theme-surface/80',
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 120%, color-mix(in oklab, var(--theme-accent) 15%, transparent), transparent 60%)',
        }}
      />
      <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-theme-accent/40 to-transparent" />
      <span className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-linear-to-r from-transparent via-theme-accent/20 to-transparent" />

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
            background:
              'radial-gradient(circle at 30% 30%, #ffffff, var(--theme-accent) 35%, color-mix(in oklab, var(--theme-accent) 55%, transparent) 70%, #000000 100%)',
          }}
        />
      ))}

      <div className="relative z-20 flex items-center gap-3 px-1">
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-theme-accent opacity-60"
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full bg-theme-accent shadow-[0_0_6px_var(--theme-accent)]"
          />
        </span>

        <span
          className={cn(
            'text-[10px] font-bold tracking-[0.15em] uppercase',
            !isThemed && 'text-theme-accent drop-shadow-[0_0_4px_color-mix(in_oklab,var(--theme-accent)_40%,transparent)]',
            isCareers &&
            'font-typewriter text-theme-accent drop-shadow-[0_0_4px_color-mix(in_oklab,var(--theme-accent)_40%,transparent)]',
            isBlog &&
            'font-typewriter text-theme-accent-hover drop-shadow-[0_0_4px_color-mix(in_oklab,var(--theme-accent-hover)_40%,transparent)]',
          )}
        >
          {children}
        </span>

        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-theme-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-theme-accent shadow-[0_0_6px_var(--theme-accent)]" />
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