import { cn } from '@/shared/lib';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Badge = ({children, className, ...props}: BadgeProps) => {
  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-3 px-4 py-1.5 rounded-sm border border-slate-700 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_5px_rgba(0,0,0,0.5)]',
        className
      )}
      {...props}
    >
      <div
        className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-950 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),1px_1px_1px_rgba(255,255,255,0.1)]"/>
      <div
        className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-950 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),1px_1px_1px_rgba(255,255,255,0.1)]"/>
      <div
        className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-950 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),1px_1px_1px_rgba(255,255,255,0.1)]"/>
      <div
        className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-950 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8),1px_1px_1px_rgba(255,255,255,0.1)]"/>

      <span className="relative flex h-2 w-2 ml-1 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
        <span
          className="relative inline-flex rounded-full h-2 w-2 bg-teal-400 shadow-[0_0_8px_#2dd4bf] border border-teal-900"></span>
      </span>

      <span
        className="text-teal-400/90 font-mono font-bold tracking-widest uppercase text-[10px] sm:text-xs drop-shadow-[0_1px_0_rgba(0,0,0,0.8)] mt-0.5 whitespace-nowrap">
        {children}
      </span>
    </div>
  );
};