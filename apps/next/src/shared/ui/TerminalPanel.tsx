import { ReactNode } from 'react';
import { Activity } from 'lucide-react';
import { Rivets } from './Rivets';
import { cn } from '@/shared/lib';

interface ITerminalPanelProps {
  children: ReactNode;
  headerTitle: ReactNode;
  headerIcon?: React.ElementType;
  headerClassName?: string;
  footer?: ReactNode;
  footerClassName?: string;
  className?: string;
  innerClassName?: string;
  hasHazardStripes?: boolean;
  withRivets?: boolean;
}

export const TerminalPanel = ({
  children,
  headerTitle,
  headerIcon: Icon = Activity,
  headerClassName,
  footer,
  footerClassName,
  className,
  innerClassName,
  withRivets,
  hasHazardStripes,
}: ITerminalPanelProps) => (
  <div
    className={cn(
      'relative flex h-full w-full flex-col rounded-2xl border-2 border-[#4a5c52] bg-linear-to-b from-[#1a2420] to-[#0f1512] p-3 shadow-[inset_0_1px_0_rgba(156,196,176,0.15),0_20px_50px_rgba(0,0,0,0.8)] sm:rounded-3xl sm:p-4',
      className,
    )}
  >
    {withRivets && <Rivets className="bg-[#3a4842]" />}

    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border border-[#2f3d36] bg-[#0a0e0d] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),inset_0_0_8px_rgba(111,162,140,0.1)]',
        innerClassName,
      )}
    >
      {hasHazardStripes && (
        <div className="h-2 w-full shrink-0 bg-[repeating-linear-gradient(-45deg,#8a2e2e,#8a2e2e_10px,#0a0e0d_10px,#0a0e0d_20px)] opacity-80" />
      )}

      <div
        className={cn(
          'relative z-10 flex shrink-0 items-center justify-between border-b border-[#2f3d36] bg-[#0f1512]/80 px-4 py-3 sm:px-6',
          headerClassName,
        )}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] text-[#6fa28c] uppercase sm:text-xs">
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
            'relative z-10 shrink-0 border-t border-[#2f3d36] bg-[#0f1512]/80 px-4 py-2 sm:px-6',
            footerClassName,
          )}
        >
          {footer}
        </div>
      )}
    </div>
  </div>
);
