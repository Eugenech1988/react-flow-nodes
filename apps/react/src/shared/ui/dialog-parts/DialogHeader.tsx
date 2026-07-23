import { X } from 'lucide-react';
import { DialogHeader as UIDialogHeader, DialogTitle } from '@pipeline/ui';

interface DialogHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

export const DialogHeader = ({
                               title,
                               description,
                               icon,
                               onClose,
                             }: DialogHeaderProps) => {
  return (
    <UIDialogHeader className="px-6 py-4 border-b border-border/60 bg-muted/10 flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <DialogTitle className="text-base font-medium text-foreground/90">
            {title}
          </DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <X className="w-4 h-4" />
      </button>
    </UIDialogHeader>
  );
};