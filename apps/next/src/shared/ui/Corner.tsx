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
          'absolute inset-0 border-teal-400/50',
          type === 'tl' && 'border-l border-t rounded-tl-sm',
          type === 'tr' && 'border-r border-t rounded-tr-sm',
          type === 'bl' && 'border-l border-b rounded-bl-sm',
          type === 'br' && 'border-r border-b rounded-br-sm'
        )}
      />
      <span
        className={cn(
          'absolute z-10 h-1.5 w-1.5 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f0fdfa,#5eead4_35%,#0f766e_70%,#042f2e_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.8),0_0_5px_rgba(57,179,155,0.45)]',
          type === 'tl' && 'left-[-3.5px] top-[-3.5px]',
          type === 'tr' && 'right-[-3.5px] top-[-3.5px]',
          type === 'bl' && 'left-[-3.5px] bottom-[-3.5px]',
          type === 'br' && 'right-[-3.5px] bottom-[-3.5px]'
        )}
      />
    </div>
  );
};