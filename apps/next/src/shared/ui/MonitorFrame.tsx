import type { ReactNode, ElementType } from 'react';
import { Activity } from 'lucide-react';
import { Rivets } from './Rivets';
import { cn } from '@/shared/lib';

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
  theme?: 'default' | 'careers' | 'blog';
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
                               theme = 'default',
                             }: IMonitorFrameProps) => {
  const isCareers = theme === 'careers';
  const isBlog = theme === 'blog';

  return (
    <div
      className={cn(
        'relative flex w-full flex-col backdrop-blur-md',
        isCareers &&
        'rounded-2xl border-2 border-[#4a5c52] bg-linear-to-b from-[#1a2420] to-[#0f1512] p-3 shadow-[inset_0_1px_0_rgba(156,196,176,0.15),0_20px_50px_rgba(0,0,0,0.8)] sm:rounded-3xl sm:p-4',
        isBlog &&
        'rounded-sm border border-blog-border bg-blog-surface/95 shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(45,212,191,0.1)]',
        !isCareers &&
        !isBlog &&
        'rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/60 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] sm:p-2',
        className,
      )}
    >
      {isBlog && (
        <>
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[16px_16px]" />
          <div className="pointer-events-none absolute inset-1 border border-blog-accent/10" />
          <span className="pointer-events-none absolute top-0 left-0 z-20 h-3 w-3 border-t-2 border-l-2 border-blog-accent/70" />
          <span className="pointer-events-none absolute top-0 right-0 z-20 h-3 w-3 border-t-2 border-r-2 border-blog-accent/70" />
          <span className="pointer-events-none absolute bottom-0 left-0 z-20 h-3 w-3 border-b-2 border-l-2 border-blog-accent/70" />
          <span className="pointer-events-none absolute right-0 bottom-0 z-20 h-3 w-3 border-r-2 border-b-2 border-blog-accent/70" />
        </>
      )}

      {!isBlog && (withRivets ?? <Rivets className={isCareers ? 'bg-[#3a4842]' : 'bg-slate-700'} />)}

      {toolbar && <div className="relative z-10 mb-3 w-full px-1">{toolbar}</div>}

      <div
        className={cn(
          'relative flex w-full flex-1 flex-col overflow-hidden',
          isCareers &&
          'rounded-xl border border-[#2f3d36] bg-[#0a0e0d] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),inset_0_0_8px_rgba(111,162,140,0.1)]',
          isBlog && 'bg-transparent',
          !isCareers && !isBlog && 'rounded-[1.4rem] border border-slate-800 bg-slate-950/90',
          innerClassName,
        )}
      >
        <div
          className={cn(
            'relative z-10 flex shrink-0 items-center justify-between border-b px-4 py-3 sm:px-6',
            isCareers && 'border-[#2f3d36] bg-[#0f1512]/80 text-[#6fa28c]',
            isBlog && 'border-blog-border bg-blog-panel text-blog-accent',
            !isCareers && !isBlog && 'border-slate-800 bg-[#0d1f1e] text-[#2dd4bf]/80',
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
              'relative z-10 shrink-0 border-t px-4 py-2 sm:px-6',
              isCareers && 'border-[#2f3d36] bg-[#0f1512]/80',
              isBlog && 'border-blog-border bg-blog-panel',
              !isCareers && !isBlog && 'border-slate-800 bg-[#0d1f1e]',
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