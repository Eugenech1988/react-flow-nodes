import { cn } from '@/shared/lib';

const DEFAULT_POSITIONS = [
  'top-3 left-3 sm:top-4 sm:left-4',
  'top-3 right-3 sm:top-4 sm:right-4',
  'bottom-3 left-3 sm:bottom-4 sm:left-4',
  'right-3 bottom-3 sm:right-4 sm:bottom-4',
];

const COMPACT_POSITIONS = ['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'right-2 bottom-2'];

interface IRivetsProps {
  className?: string;
  compact?: boolean;
}

export const Rivets = ({ className, compact = false }: IRivetsProps) => {
  const positions = compact ? COMPACT_POSITIONS : DEFAULT_POSITIONS;

  return (
    <>
      {positions.map((pos) => (
        <span
          key={pos}
          className={cn(
            'absolute z-20 h-1.5 w-1.5 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]',
            pos,
            !compact && 'sm:h-2 sm:w-2',
            className || 'bg-theme-rivet',
          )}
        />
      ))}
    </>
  );
};