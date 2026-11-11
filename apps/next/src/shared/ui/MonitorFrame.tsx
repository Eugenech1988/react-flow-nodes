import type { ReactNode, ElementType } from 'react';
import { Activity } from 'lucide-react';
import { Rivets } from './Rivets';
import { cn } from '@/shared/lib';
import { themeScope, type TUiTheme } from './theme';

interface IMonitorFrameProps {
  children: ReactNode;
  headerTitle: ReactNode;
  headerIcon?: ElementType;
  headerClassName?: string;
  footer?: ReactNode;
  footerClassName?: string;
  className?: string;
  innerClassName?: string;
  toolbar?: ReactNode;
  /** Структурный вариант рамки + область темы. Без пропса цвета наследуются от предка. */
  theme?: TUiTheme;
  withRivets?: boolean;
}

export const MonitorFrame = ({
                               children,
                               headerTitle,
                               headerIcon: Icon = Activity,
                               headerClassName,
                               footer,
                               footerClassName,
                               className,
                               innerClassName,
                               toolbar,
                               withRivets,
                               theme,
                             }: IMonitorFrameProps) => {
  const isCareers = theme === 'careers';
  const isBlog = theme === 'blog';
  const isDefault = !isCareers && !isBlog;

  return (
    <div
      {...themeScope(theme)}
      className={cn(
        'relative flex w-full flex-col backdrop-blur-md',
        isCareers &&
        'rounded-2xl border-2 border-theme-line-strong bg-linear-to-b from-theme-raised to-theme-panel p-3 shadow-theme-frame sm:rounded-3xl sm:p-4',
        isBlog && 'rounded-sm border border-theme-line bg-theme-surface/95 shadow-theme-panel',
        isDefault &&
        'rounded-3xl border border-theme-accent/30 bg-theme-surface/60 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] sm:p-2',
        className,
      )}
    >
      {isBlog && (
        <>
          <span className="theme-grid pointer-events-none absolute inset-0 bg-size-[16px_16px]" />
          <div className="pointer-events-none absolute inset-1 border border-theme-accent/10" />
          <span className="pointer-events-none absolute top-0 left-0 z-20 h-3 w-3 border-t-2 border-l-2 border-theme-accent/70" />
          <span className="pointer-events-none absolute top-0 right-0 z-20 h-3 w-3 border-t-2 border-r-2 border-theme-accent/70" />
          <span className="pointer-events-none absolute bottom-0 left-0 z-20 h-3 w-3 border-b-2 border-l-2 border-theme-accent/70" />
          <span className="pointer-events-none absolute right-0 bottom-0 z-20 h-3 w-3 border-r-2 border-b-2 border-theme-accent/70" />
        </>
      )}

      {!isBlog && withRivets !== false && <Rivets className="bg-theme-rivet" />}

      {toolbar && <div className="relative z-10 mb-3 w-full px-1">{toolbar}</div>}

      <div
        className={cn(
          'relative flex w-full flex-1 flex-col overflow-hidden',
          isCareers &&
          'rounded-xl border border-theme-line bg-theme-surface shadow-[inset_0_0_40px_rgba(0,0,0,0.9),inset_0_0_8px_color-mix(in_oklab,var(--theme-accent)_10%,transparent)]',
          isBlog && 'bg-transparent',
          isDefault && 'rounded-[1.4rem] border border-theme-line bg-theme-bg/90',
          innerClassName,
        )}
      >
        <div
          className={cn(
            'relative z-10 flex shrink-0 items-center justify-between border-b border-theme-line px-4 py-3 sm:px-6',
            isCareers ? 'bg-theme-panel/80' : 'bg-theme-panel',
            isDefault ? 'text-theme-accent/80' : 'text-theme-accent',
            headerClassName,
          )}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase sm:text-xs">
            <Icon className="h-4 w-4" />
            <span>{headerTitle}</span>
          </div>
          <div className="mr-1 flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500/80" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
            <span className="h-2 w-2 rounded-full bg-green-500/80 shadow-[0_0_5px_#22c55e]" />
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>

        {footer && (
          <div
            className={cn(
              'relative z-10 shrink-0 border-t border-theme-line px-4 py-2 sm:px-6',
              isCareers ? 'bg-theme-panel/80' : 'bg-theme-panel',
              footerClassName,
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
