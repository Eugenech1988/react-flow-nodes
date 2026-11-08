import { ReactNode } from 'react';
import { Activity } from 'lucide-react';
import { Rivets } from './rivets';
import { cn } from '@/shared/lib';

interface IMonitorFrameProps {
  children: ReactNode;
  headerTitle: ReactNode;
  headerIcon?: React.ElementType;
  headerClassName?: string;
  footer?: ReactNode;
  footerClassName?: string;
  className?: string;
  innerClassName?: string;
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
  withRivets,
}: IMonitorFrameProps) => (
  <div
    className={cn(
      'relative flex w-full flex-col rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/60 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-2',
      className,
    )}
  >
    {withRivets && <Rivets className="bg-slate-700" />}

    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-[1.4rem] border border-slate-800 bg-slate-950/90',
        innerClassName,
      )}
    >
      <div
        className={cn(
          'relative z-10 flex shrink-0 items-center justify-between border-b border-slate-800 bg-[#0d1f1e] px-4 py-3 sm:px-6',
          headerClassName,
        )}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#2dd4bf]/80 sm:text-xs">
          <Icon className="h-4 w-4" />
          <span>{headerTitle}</span>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500/50" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/50" />
          <span className="h-2 w-2 rounded-full bg-green-500/50 shadow-[0_0_5px_#22c55e]" />
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>

      {footer && (
        <div
          className={cn(
            'relative z-10 shrink-0 border-t border-slate-800 bg-[#0d1f1e] px-4 py-3 sm:px-6',
            footerClassName,
          )}
        >
          {footer}
        </div>
      )}
    </div>
  </div>
);
