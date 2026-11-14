import { cn } from '@/shared/lib';

interface ISignalBarsProps {
  className?: string;
}

const BARS = [40, 60, 80, 100, 70];

export const SignalBars = ({ className }: ISignalBarsProps) => (
  <div className={cn('flex h-6 items-end gap-1', className)}>
    {BARS.map((height, i) => (
      <span
        key={i}
        className="bg-theme-accent/70 w-1.5 animate-pulse rounded-sm motion-reduce:animate-none"
        style={{ height: `${height}%`, animationDelay: `${i * 150}ms` }}
      />
    ))}
  </div>
);
