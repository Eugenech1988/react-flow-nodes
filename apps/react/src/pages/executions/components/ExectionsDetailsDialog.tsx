import { Terminal, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@pipeline/ui';
import { DialogBody, DialogFooter, DialogHeader } from '@/shared/ui';

import { DetailsRow } from './DetailsRow';
import type { IExecutionItem } from '@/pages/executions/model';
import { formatTimestamp } from '@/shared/lib';

export type TExecutionLog = {
  id: string;
  nodeId?: string;
  timestamp: number | string;
  type: 'info' | 'success' | 'error';
  message: string;
  order?: number;
};

type TExecutionDetailsDialogProps = {
  execution:
    | (IExecutionItem & {
        logs?: Record<string, TExecutionLog> | TExecutionLog[];
      })
    | null;
  onClose: () => void;
};

const LOG_TYPE_STYLES: Record<
  TExecutionLog['type'],
  { text: string; bg: string; icon: typeof Info }
> = {
  info: {
    text: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    icon: Info,
  },
  success: {
    text: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    icon: CheckCircle2,
  },
  error: {
    text: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    icon: AlertCircle,
  },
};

const normalizeLogs = (
  raw: Record<string, TExecutionLog> | TExecutionLog[] | undefined,
): TExecutionLog[] => {
  if (!raw) return [];
  const list = Array.isArray(raw) ? [...raw] : Object.values(raw);
  return list
    .map((log, index) => ({
      log,
      index,
      order:
        typeof log?.order === 'number' && Number.isFinite(log.order)
          ? log.order
          : Number.MAX_SAFE_INTEGER,
      timestamp:
        typeof log?.timestamp === 'number'
          ? log.timestamp
          : new Date(log?.timestamp ?? 0).getTime(),
    }))
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      if (a.order === Number.MAX_SAFE_INTEGER && a.timestamp !== b.timestamp) {
        return a.timestamp - b.timestamp;
      }
      return a.index - b.index;
    })
    .map((entry) => entry.log);
};

export const ExecutionDetailsDialog = ({ execution, onClose }: TExecutionDetailsDialogProps) => {
  const logsList = normalizeLogs(execution?.logs);

  return (
    <Dialog open={Boolean(execution)} onOpenChange={onClose}>
      {execution && (
        <DialogContent
          showCloseButton={false}
          className="border-border bg-card gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg"
        >
          <DialogHeader
            title="Execution Details"
            description="Full execution runtime log summary"
            icon={<Terminal className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
            onClose={onClose}
          />

          <DialogBody
            withBorder
            className="my-0 max-h-105 space-y-4 overflow-y-auto border-0 py-3 text-xs"
          >
            <div className="space-y-1">
              <DetailsRow label="Execution ID" value={execution.id} mono />
              <DetailsRow label="Pipeline Name" value={execution.pipelineName} />
              <DetailsRow label="Trigger Source" value={execution.triggeredBy} />
              <DetailsRow label="Start Timestamp" value={execution.startedAt} mono />
              <DetailsRow label="Total Duration" value={execution.duration} mono last />
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                Execution Logs ({logsList.length})
              </div>

              {logsList.length > 0 ? (
                <div className="border-border bg-muted/30 max-h-56 space-y-1.5 overflow-y-auto rounded-lg border p-2.5 font-mono text-[11px]">
                  {logsList.map((log, index) => {
                    const style = LOG_TYPE_STYLES[log.type] ?? LOG_TYPE_STYLES.info;
                    const Icon = style.icon;

                    return (
                      <div
                        key={log.id ?? `${index}-${log.timestamp}`}
                        className="flex items-start gap-2 leading-relaxed"
                      >
                        <span className="text-muted-foreground shrink-0 select-none">
                          [{formatTimestamp(log.timestamp)}]
                        </span>

                        <span
                          className={`py-0.2 inline-flex shrink-0 items-center gap-1 rounded border px-1.5 font-sans text-[10px] font-medium uppercase ${style.text} ${style.bg}`}
                        >
                          <Icon className="h-3 w-3" />
                          {log.type}
                        </span>

                        <span className="text-foreground break-all">{log.message}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground rounded-lg border border-dashed py-4 text-center text-xs italic">
                  No logs recorded for this execution.
                </div>
              )}
            </div>
          </DialogBody>

          <DialogFooter onCancel={onClose} showSubmit={false} cancelText="Close" />
        </DialogContent>
      )}
    </Dialog>
  );
};
