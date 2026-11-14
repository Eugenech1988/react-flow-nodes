import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent } from '@pipeline/ui';
import { DialogHeader, DialogBody, DialogFooter, FloatingInput } from '@/shared/ui';

const CONFIRMATION_WORD = 'DELETE';

interface IDeleteAccountDialogProps {
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
}: IDeleteAccountDialogProps) => {
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    if (isOpen) setConfirmation('');
  }, [isOpen]);

  const isConfirmed = confirmation === CONFIRMATION_WORD;
  const hasMismatch = confirmation.length > 0 && !isConfirmed;

  const handleClose = () => {
    if (isDeletePending) return;
    onClose();
  };

  const handleConfirm = () => {
    if (!isConfirmed) return;
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="border-border bg-card gap-0 overflow-hidden rounded-xl p-0 shadow-lg backdrop-blur-md sm:max-w-md"
      >
        <DialogHeader
          title="Delete Account"
          icon={<AlertTriangle className="h-5 w-5 text-rose-500" />}
          onClose={handleClose}
        />

        <DialogBody withBorder className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Are you sure you want to delete your account? This action cannot be undone and all your
            data, transactions, and pipelines will be permanently removed.
          </p>

          <FloatingInput
            id="delete-account-confirmation"
            label={`Type ${CONFIRMATION_WORD} to confirm`}
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            autoComplete="off"
            disabled={isDeletePending}
            error={hasMismatch}
            errorMessage={hasMismatch ? `Type "${CONFIRMATION_WORD}" exactly` : undefined}
            className="font-mono uppercase"
            labelClasses="!peer-focus:!text-rose-500 peer-not-placeholder-shown:!text-rose-500 [&]:!peer-[:autofill]:!text-rose-500"
            fieldsetClasses="!peer-focus:!border-rose-500/60 !peer-not-placeholder-shown:!border-rose-500/40 !group-hover:!border-rose-500/30 !peer-[:autofill]:!border-rose-500/60"
          />
        </DialogBody>

        <DialogFooter
          onCancel={handleClose}
          onSubmit={handleConfirm}
          isPending={isDeletePending}
          isDisabled={!isConfirmed}
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
