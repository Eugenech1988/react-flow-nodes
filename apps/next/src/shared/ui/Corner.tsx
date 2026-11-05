import { cn } from '@/shared/lib';

interface ICornerProps {
  type: 'tl' | 'tr' | 'bl' | 'br';
  className?: string;
}

export const Corner = ({ type, className }: ICornerProps) => {
  return (
    <div className={cn('pointer-events-none absolute h-3.5 w-3.5', className)}>
      <span
        className={cn(
          'absolute z-10 h-1.5 w-1.5 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f0fdfa,#5eead4_35%,#0f766e_70%,#042f2e_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.8),0_0_5px_rgba(57,179,155,0.45)]',
          type === 'tl' && 'top-[-3.5px] left-[-3.5px]',
          type === 'tr' && 'top-[-3.5px] right-[-3.5px]',
          type === 'bl' && 'bottom-[-3.5px] left-[-3.5px]',
          type === 'br' && 'right-[-3.5px] bottom-[-3.5px]',
        )}
      />
    </div>
  );
};
