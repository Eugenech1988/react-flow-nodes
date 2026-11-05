import { cn } from '@/shared/lib';

interface IInfoBadgeProps {
  text?: string;
  className?: string;
}

export const InfoBadge = ({ text, className }: IInfoBadgeProps) => {
  return (
    <div
      className={cn(
        'relative flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-md border border-teal-500/30 bg-white/5 px-5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md',
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(57,179,155,0.15),transparent_60%)]" />

      <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-linear-to-r from-transparent via-teal-300/40 to-transparent" />
      <span className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-linear-to-r from-transparent via-teal-400/20 to-transparent" />

      <span className="pointer-events-none absolute left-1.25 top-1.25 z-10 h-1 w-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f0fdfa,#5eead4_35%,#0f766e_70%,#042f2e_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.8),0_0_5px_rgba(57,179,155,0.45)]" />
      <span className="pointer-events-none absolute right-1.25 top-1.25 z-10 h-1 w-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f0fdfa,#5eead4_35%,#0f766e_70%,#042f2e_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.8),0_0_5px_rgba(57,179,155,0.45)]" />
      <span className="pointer-events-none absolute bottom-1.25 left-1.25 z-10 h-1 w-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f0fdfa,#5eead4_35%,#0f766e_70%,#042f2e_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.8),0_0_5px_rgba(57,179,155,0.45)]" />
      <span className="pointer-events-none absolute bottom-1.25 right-1.25 z-10 h-1 w-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f0fdfa,#5eead4_35%,#0f766e_70%,#042f2e_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.8),0_0_5px_rgba(57,179,155,0.45)]" />

      <div className="relative z-20 flex items-center gap-3 px-1">
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(57,179,155,1)]" />
        </span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-teal-300/90 drop-shadow-[0_0_4px_rgba(57,179,155,0.4)]">
          {text}
        </span>
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(57,179,155,1)]" />
        </span>
      </div>
    </div>
  );
};