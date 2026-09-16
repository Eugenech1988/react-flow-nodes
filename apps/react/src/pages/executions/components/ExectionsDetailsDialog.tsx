import { Terminal } from 'lucide-react';
import { Dialog, DialogContent } from '@pipeline/ui';
import { DialogBody, DialogFooter, DialogHeader } from '@/shared/ui';

import { DetailsRow } from './DetailsRow';
// import { StatusBadge } from './StatusBadge';
import type { IExecutionItem } from '@/pages/executions/model';

type TExecutionDetailsDialogProps = {
  execution: IExecutionItem | null;
  onClose: () => void;
};

export const ExecutionDetailsDialog = ({
                                         execution,
                                         onClose,
                                       }: TExecutionDetailsDialogProps) => (
  <Dialog open={Boolean(execution)} onOpenChange={onClose}>
    {execution && (
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md p-0 gap-0 overflow-hidden border-border bg-card rounded-2xl"
      >
        <DialogHeader
          title={`Execution Details — ${execution.id}`}
          description="Full execution runtime log summary"
          icon={
            <Terminal className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          }
          onClose={onClose}
        />

        <DialogBody
          withBorder
          className="text-xs my-0 border-0 py-2 space-y-1"
        >
          {/*<DetailsRow label="Workflow Name" value={execution.workflowName} />*/}
          {/*<DetailsRow*/}
          {/*  label="Status"*/}
          {/*  value={<StatusBadge status={execution.status} />}*/}
          {/*/>*/}
          <DetailsRow label="Trigger Source" value={execution.triggeredBy} />
          <DetailsRow
            label="Start Timestamp"
            value={execution.startedAt}
            mono
          />
          <DetailsRow
            label="Total Duration"
            value={execution.duration}
            mono
            last
          />
        </DialogBody>

        <DialogFooter
          onCancel={onClose}
          showSubmit={false}
          cancelText="Close"
        />
      </DialogContent>
    )}
  </Dialog>
);