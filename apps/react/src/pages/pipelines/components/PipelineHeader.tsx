import { Workflow, Plus } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { usePipelineDialogStore } from '../model';

export const PipelineHeader = () => {
  const openCreateModal = usePipelineDialogStore((state) => state.openCreateModal);

  return (
    <div className="border-border/60 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Workflow className="h-6 w-6 text-teal-600" />
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Pipelines</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage, automate, and monitor your data workflows and integrations.
        </p>
      </div>

      <AppButton
        variant="primary"
        size="md"
        text="Create Pipeline"
        icon={Plus}
        onClick={openCreateModal}
      />
    </div>
  );
};
