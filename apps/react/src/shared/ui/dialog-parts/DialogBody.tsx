import { cn } from '@/shared/lib';

interface DialogBodyProps {
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}

export const DialogBody = ({
                             children,
                             className,
                             withBorder = false,
                           }: DialogBodyProps) => {
  return (
    <div
      className={cn(
        'mx-6 py-4',
        withBorder && 'border-t border-b border-border/60',
        className
      )}
    >
      {children}
    </div>
  );
};