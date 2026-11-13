import { cn } from '@/shared/lib';

interface IBackgroundGridProps {
  variant?: 'dots' | 'lines';
  className?: string;
}

export const BackgroundGrid = ({ variant = 'dots', className }: IBackgroundGridProps) => {
  const isDots = variant === 'dots';

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0',
        isDots
          ? 'bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--theme-accent)_8%,transparent)_1px,transparent_1.5px)] bg-size-[16px_16px]'
          : 'bg-[linear-gradient(to_right,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_1px,transparent_1px)] bg-size-[4rem_4rem]',
        className
      )}
    />
  );
};