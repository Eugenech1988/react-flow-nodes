import { X } from 'lucide-react';
import { DialogHeader as UIDialogHeader, DialogTitle } from '@pipeline/ui';

interface DialogHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

export const DialogHeader = ({ title, description, icon, onClose }: DialogHeaderProps) => {
  return (
    <UIDialogHeader className="bg-muted/10 relative px-6 py-4">
      <div className="flex items-start gap-3">
        <div className="space-y-0.5">
          <DialogTitle className="text-foreground flex items-center gap-2 text-base font-semibold tracking-tight">
            {icon}
            {title}
          </DialogTitle>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground hover:bg-muted/60 focus-visible:ring-ring/50 absolute top-4 right-4 cursor-pointer rounded-lg p-1.5 transition-colors outline-none focus-visible:ring-2"
      >
        <X className="h-4 w-4" />
      </button>
    </UIDialogHeader>
  );
};
