import { cn } from '@/shared/lib';

interface FictionalBadgeProps {
  text?: string;
  className?: string;
}

export const FictionalBadge = ({ text = 'All names are fictional', className }: FictionalBadgeProps) => {
  return (
    <div
      className={cn(
        'relative flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-md border border-teal-500/30 bg-white/5 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.4)] backdrop-blur-md',
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(57,179,155,0.15),transparent_60%)]" />

      <div className="relative flex items-center gap-3">
        <span className="h-1 w-1 shrink-0 rounded-full bg-teal-300/40 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8),0_0_3px_rgba(57,179,155,0.4)]" />

        <span className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(57,179,155,1)]" />
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-teal-300/90 drop-shadow-[0_0_4px_rgba(57,179,155,0.4)]">
            {text}
          </span>
        </span>

        <span className="h-1 w-1 shrink-0 rounded-full bg-teal-300/40 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8),0_0_3px_rgba(57,179,155,0.4)]" />
      </div>
    </div>
  );
};