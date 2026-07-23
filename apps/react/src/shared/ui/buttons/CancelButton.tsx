import { Button } from '@pipeline/ui';

interface CancelButtonProps {
  onClick: () => void;
  text?: string;
  isDisabled?: boolean;
}

export const CancelButton = ({
                               onClick,
                               text = 'Cancel',
                               isDisabled = false,
                             }: CancelButtonProps) => (
  <Button
    type="button"
    variant="outline"
    disabled={isDisabled}
    onClick={onClick}
    className="px-4 py-4.5 text-sm font-medium text-muted-foreground hover:text-foreground border-border/80 hover:bg-muted/50 rounded-lg cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
  >
    {text}
  </Button>
);