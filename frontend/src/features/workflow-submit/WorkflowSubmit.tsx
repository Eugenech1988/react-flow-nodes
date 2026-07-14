import { Button } from '@/shared/ui';
import { Play } from 'lucide-react';
import { useWorkflowSubmit } from './WorkflowSubmit.utils';
import { WorkflowSubmitModal } from './WorkflowSubmit.parts';

export const WorkflowSubmit = () => {
  const {
    isSubmitting,
    isConnecting,
    isSubmittedSuccessfully,
    result,
    validation,
    error,
    localErrors,
    submit,
    reset,
  } = useWorkflowSubmit();

  const isModalOpen =
    validation !== null || error !== null || isConnecting || isSubmittedSuccessfully;

  return (
    <>
      <Button
        variant="default"
        onClick={submit}
        disabled={isSubmitting}
        className="cursor-pointer h-10 rounded-full shadow-md hover:shadow-lg active:scale-[0.98] px-6 py-2.5 transition-all font-medium tracking-wide flex items-center gap-2"
      >
        <Play className="h-4 w-4 fill-current" />
        {isSubmitting ? 'Validating schema…' : 'Execute Workflow'}
      </Button>

      <WorkflowSubmitModal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) reset();
        }}
        isConnecting={isConnecting}
        isSubmittedSuccessfully={isSubmittedSuccessfully}
        result={result}
        validation={validation}
        error={error}
        localErrors={localErrors}
        onClose={reset}
      />
    </>
  );
};