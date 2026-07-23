import { useState } from 'react';
import { Workflow, Plus } from 'lucide-react';
import { SubmitButton } from '@/shared/ui/buttons';
import { CreatePipelineDialog } from './CreatePipelineDialog';

export const PipelineHeader = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Workflow className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pipelines</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage, automate, and monitor your data workflows and integrations.
        </p>
      </div>

      <SubmitButton
        isPending={false}
        isDisabled={false}
        text="Create Pipeline"
        pendingText="Creating..."
        icon={Plus}
        onClick={() => setIsCreateOpen(true)}
      />

      <CreatePipelineDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
};