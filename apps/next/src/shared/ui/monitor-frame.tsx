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
  toolbar?: ReactNode;
  theme?: 'default' | 'steampunk';
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
  theme = 'default',
}: IMonitorFrameProps) => {
  const isSteampunk = theme === 'steampunk';

  return (
    <div
      className={cn(
        'relative flex w-full flex-col backdrop-blur-md',
        isSteampunk
          ? 'rounded-2xl border-2 border-[#4a5c52] bg-linear-to-b from-[#1a2420] to-[#0f1512] p-3 shadow-[inset_0_1px_0_rgba(156,196,176,0.15),0_20px_50px_rgba(0,0,0,0.8)] sm:rounded-3xl sm:p-4'
          : 'rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/60 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] sm:p-2',
        className,
      )}
    >
      <Rivets className={isSteampunk ? 'bg-[#3a4842]' : 'bg-slate-700'} />

      {/* Панель инструментов (табы) на безеле */}
      {toolbar && <div className="relative z-10 mb-3 w-full px-1">{toolbar}</div>}

      <div
        className={cn(
          'relative flex w-full flex-1 flex-col overflow-hidden',
          isSteampunk
            ? 'rounded-xl border border-[#2f3d36] bg-[#0a0e0d] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),inset_0_0_8px_rgba(111,162,140,0.1)]'
            : 'rounded-[1.4rem] border border-slate-800 bg-slate-950/90',
          innerClassName,
        )}
      >
        <div
          className={cn(
            'relative z-10 flex shrink-0 items-center justify-between border-b px-4 py-3 sm:px-6',
            isSteampunk
              ? 'border-[#2f3d36] bg-[#0f1512]/80 text-[#6fa28c]'
              : 'border-slate-800 bg-[#0d1f1e] text-[#2dd4bf]/80',
            headerClassName,
          )}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase sm:text-xs">
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
              'relative z-10 shrink-0 border-t px-4 py-2 sm:px-6',
              isSteampunk ? 'border-[#2f3d36] bg-[#0f1512]/80' : 'border-slate-800 bg-[#0d1f1e]',
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
