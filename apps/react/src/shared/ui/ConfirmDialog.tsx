import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent } from '@pipeline/ui';
import { DialogHeader, DialogFooter, DialogBody } from './dialog-parts';

interface IConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  isPending?: boolean;
  submitText?: string;
  pendingText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
  icon?: LucideIcon;
}

export const ConfirmDialog = ({
                                isOpen,
                                onClose,
                                onConfirm,
                                title,
                                message,
                                isPending = false,
                                submitText = 'Confirm',
                                pendingText = 'Processing...',
                                cancelText = 'Cancel',
                                variant = 'danger',
                                icon: Icon = AlertTriangle,
                              }: IConfirmDialogProps) => {
  const iconColor =
    variant === 'danger'
      ? 'text-rose-600 dark:text-rose-400'
      : 'text-teal-600 dark:text-teal-400';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="border-border bg-card gap-0 overflow-hidden rounded-xl p-0 shadow-lg backdrop-blur-md sm:max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        <DialogHeader
          title={title}
          icon={<Icon className={`h-5 w-5 ${iconColor}`} />}
          onClose={onClose}
        />

        <DialogBody withBorder>
          <div className="text-muted-foreground text-sm leading-relaxed">{message}</div>
        </DialogBody>

        <DialogFooter
          onCancel={onClose}
          onSubmit={onConfirm}
          isPending={isPending}
          submitText={submitText}
          pendingText={pendingText}
          cancelText={cancelText}
          variant={variant}
          isReversedBtns
        />
      </DialogContent>
    </Dialog>
  );
};