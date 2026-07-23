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
    <UIDialogHeader className="relative px-6 py-4 bg-muted/10">
      <div className="flex items-start gap-3">
        <div className="space-y-0.5">
          <DialogTitle className="text-base flex items-center gap-2 font-semibold text-foreground tracking-tight">
            {icon}
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
        className="absolute right-4 top-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <X className="w-4 h-4" />
      </button>
    </UIDialogHeader>
  );
};