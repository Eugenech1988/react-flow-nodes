import type { ReactNode } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent } from '@pipeline/ui';
import { DialogHeader } from './dialog-parts/DialogHeader';
import { DialogBody } from './dialog-parts/DialogBody';
import { DialogFooter } from './dialog-parts/DialogFooter';

interface IConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  title: string;
  message: ReactNode;
  submitText?: string;
  pendingText?: string;
  cancelText?: string;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  title,
  message,
  submitText = 'Delete Permanently',
  pendingText = 'Deleting...',
  cancelText = 'Cancel',
}: IConfirmDeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="border-border bg-card gap-0 overflow-hidden rounded-xl p-0 shadow-lg backdrop-blur-md sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader
          title={title}
          icon={<AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
          onClose={onClose}
        />

        <DialogBody withBorder>
          <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
        </DialogBody>

        <DialogFooter
          onCancel={onClose}
          onSubmit={onConfirm}
          isPending={isPending}
          submitText={submitText}
          pendingText={pendingText}
          cancelText={cancelText}
          variant="danger"
          icon={Trash2}
          isReversedBtns
        />
      </DialogContent>
    </Dialog>
  );
};
