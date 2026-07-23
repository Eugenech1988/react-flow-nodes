import { Button } from '@pipeline/ui';
import { cn } from '@/shared/lib';

interface CancelButtonProps {
  onClick: () => void;
  text?: string;
  isDisabled?: boolean;
  className?: string;
}

export const CancelButton = ({
                               onClick,
                               text = 'Cancel',
                               isDisabled = false,
                               className
                             }: CancelButtonProps) => (
  <Button
    type="button"
    variant="outline"
    disabled={isDisabled}
    onClick={onClick}
    className={cn('px-4 py-4.5 text-sm font-medium text-muted-foreground hover:text-foreground border-border/80 hover:bg-muted/50 rounded-lg cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-xl',
      className
    )}
  >
    {text}
  </Button>
);