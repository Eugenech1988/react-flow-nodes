import { useState } from 'react';
import { Workflow, Plus } from 'lucide-react';
import { Button } from '@pipeline/ui';
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

      <Button
        onClick={() => setIsCreateOpen(true)}
        className="flex items-center justify-center gap-2 px-4 py-4.5 text-sm font-medium text-white bg-linear-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 active:from-teal-800 active:to-teal-700 rounded-xl cursor-pointer shadow-xs transition-all shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20"
      >
        <Plus className="w-4 h-4 text-white" />
        <span>Create Pipeline</span>
      </Button>
      <CreatePipelineDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
};