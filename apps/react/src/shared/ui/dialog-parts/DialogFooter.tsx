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
  isReversedBtns?: boolean; // <-- Новый пропс
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
                               isReversedBtns = false,
                             }: DialogFooterProps) => {
  const renderActionBtn = () => {
    if (variant === 'danger') {
      return (
        <DangerButton
          onClick={onSubmit || (() => {})}
          isPending={isPending}
          text={submitText}
          icon={icon}
        />
      );
    }

    return (
      <SubmitButton
        onClick={onSubmit}
        isPending={isPending}
        isDisabled={false}
        text={submitText}
        pendingText={pendingText}
        icon={icon}
      />
    );
  };

  const renderCancelBtn = () => (
    <CancelButton onClick={onCancel} isDisabled={isPending} text={cancelText} />
  );

  return (
    <div
      className={`flex flex-col-reverse bg-background sm:flex-row sm:justify-end gap-2 p-4 ${
        withBorder ? 'border-t border-b border-border/60' : ''
      }`}
    >
      {isReversedBtns ? (
        <>
          {renderActionBtn()}
          {renderCancelBtn()}
        </>
      ) : (
        <>
          {renderCancelBtn()}
          {renderActionBtn()}
        </>
      )}
    </div>
  );
};