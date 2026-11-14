import { ConfirmDeleteModal } from '@/shared/ui/ConfirmDeleteModal';

interface IPipelineDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  pipelineName: string;
}

export const PipelineDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  pipelineName,
}: IPipelineDeleteModalProps) => {
  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      title="Delete Pipeline"
      message={
        <>
          Are you sure you want to delete <strong>&quot;{pipelineName}&quot;</strong>? This action
          cannot be undone and all associated executions and logs will be permanently removed.
        </>
      }
    />
  );
};
