import { AppButton, type ButtonVariant } from '@/shared/ui';
import type { LucideIcon } from 'lucide-react';

interface DialogFooterProps {
  onCancel: () => void;
  onSubmit?: () => void;
  isPending?: boolean;
  submitText?: string;
  pendingText?: string;
  cancelText?: string;
  variant?: 'submit' | 'danger' | ButtonVariant;
  icon?: LucideIcon | null;
  withBorder?: boolean;
  isReversedBtns?: boolean;
  isDisabled?: boolean;
  showSubmit?: boolean;
  showCancel?: boolean;
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
                               isDisabled = false,
                               showSubmit = true,
                               showCancel = true,
                             }: DialogFooterProps) => {
  const renderActionBtn = () => {
    if (!showSubmit) return null;

    const buttonVariant: ButtonVariant =
      variant === 'submit' ? 'primary' : variant === 'danger' ? 'danger' : (variant as ButtonVariant);

    return (
      <AppButton
        type="submit"
        variant={buttonVariant}
        onClick={onSubmit}
        isPending={isPending}
        isDisabled={isDisabled}
        text={submitText}
        pendingText={pendingText}
        icon={icon}
      />
    );
  };

  const renderCancelBtn = () => {
    if (!showCancel) return null;

    return (
      <AppButton
        type="button"
        variant="secondary"
        onClick={onCancel}
        isDisabled={isPending}
        text={cancelText}
      />
    );
  };

  if (!showSubmit && !showCancel) {
    return null;
  }

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