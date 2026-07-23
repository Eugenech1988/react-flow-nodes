import { CancelButton, SubmitButton, DangerButton } from '@/shared/ui/buttons';
import type { LucideIcon } from 'lucide-react';

interface DialogFooterProps {
  onCancel: () => void;
  onSubmit?: () => void;
  isPending?: boolean;
  submitText?: string;
  pendingText?: string;
  cancelText?: string;
  variant?: 'submit' | 'danger';
  icon?: LucideIcon | null;
  withBorder?: boolean;
}

export const DialogFooter = ({
                               onCancel,
                               onSubmit,
                               isPending = false,
                               submitText = 'Save',
                               pendingText = 'Saving...',
                               cancelText = 'Cancel',
                               variant = 'submit',
                               icon,
                               withBorder = false,
                             }: DialogFooterProps) => {
  return (
    <div
      className={`flex flex-col-reverse bg-background sm:flex-row sm:justify-end gap-2 px-6 py-4 ${
        withBorder ? 'border-t border-b border-border/60' : ''
      }`}
    >
      <CancelButton onClick={onCancel} isDisabled={isPending} text={cancelText} />

      {variant === 'danger' ? (
        <DangerButton
          onClick={onSubmit || (() => {})}
          isPending={isPending}
          text={submitText}
          icon={icon}
          // size="xs"
        />
      ) : (
        <SubmitButton
          onClick={onSubmit}
          isPending={isPending}
          isDisabled={false}
          text={submitText}
          pendingText={pendingText}
          icon={icon}
        />
      )}
    </div>
  );
};