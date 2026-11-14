import { ConfirmDeleteModal } from '@/shared/ui/ConfirmDeleteModal';

interface IDeleteJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  jobSlug: string;
}

export const JobDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  jobSlug,
}: IDeleteJobModalProps) => {
  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      title="Delete Job"
      message={
        <>
          Are you sure you want to delete the job <strong>&quot;{jobSlug}&quot;</strong>? This action
          cannot be undone and all associated translations will be permanently removed.
        </>
      }
    />
  );
};
