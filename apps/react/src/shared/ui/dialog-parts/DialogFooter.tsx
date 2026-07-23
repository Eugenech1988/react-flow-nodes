import { Loader2 } from 'lucide-react';
import { Button } from '@pipeline/ui';

interface DialogFooterProps {
  onCancel: () => void;
  onSubmit?: () => void;
  isPending?: boolean;
  submitText?: string;
  pendingText?: string;
  cancelText?: string;
}

export const DialogFooter = ({
                               onCancel,
                               isPending = false,
                               submitText = 'Save',
                               pendingText = 'Saving...',
                               cancelText = 'Cancel',
                             }: DialogFooterProps) => {
  return (
    <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="px-4 py-4.5 text-xs font-medium text-muted-foreground hover:text-foreground border-border/80 hover:bg-muted/50 rounded-lg cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-4.5 text-sm font-medium text-white bg-linear-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 active:from-teal-800 active:to-teal-700 rounded-lg cursor-pointer shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20 disabled:opacity-50 disabled:pointer-events-none"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>{pendingText}</span>
          </>
        ) : (
          <span>{submitText}</span>
        )}
      </Button>
    </div>
  );
};