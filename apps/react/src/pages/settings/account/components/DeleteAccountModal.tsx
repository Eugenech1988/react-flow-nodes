import { AlertTriangle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent } from '@pipeline/ui';
import { DialogHeader, DialogBody, DialogFooter } from '@/shared/ui';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeletePending?: boolean;
}

export const DeleteAccountModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeletePending = false,
}: DeleteAccountDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="border-border bg-card gap-0 overflow-hidden rounded-xl p-0 shadow-lg backdrop-blur-md sm:max-w-md"
      >
        <DialogHeader
          title="Delete Account"
          icon={<AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
          onClose={onClose}
        />

        <DialogBody withBorder>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Are you sure you want to delete your account? This action cannot be undone and all your
            data, transactions, and pipelines will be permanently removed.
          </p>
        </DialogBody>

        <DialogFooter
          onCancel={onClose}
          onSubmit={onConfirm}
          isPending={isDeletePending}
          submitText="Delete Permanently"
          pendingText="Deleting..."
          cancelText="Cancel"
          variant="danger"
          icon={Trash2}
          isReversedBtns
        />
      </DialogContent>
    </Dialog>
  );
};
