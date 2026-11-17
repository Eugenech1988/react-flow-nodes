import type { ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

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
                                   }: IConfirmDeleteModalProps) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    isPending={isPending}
    title={title}
    message={message}
    submitText={submitText}
    pendingText={pendingText}
    cancelText={cancelText}
    variant="danger"
    icon={Trash2}
  />
);