import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  ExternalLink,
  Filter,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Terminal,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pipeline/ui';

import { AppButton, DialogBody, DialogFooter, DialogHeader, TableSkeleton } from '@/shared/ui';

export type TExecutionStatus = 'success' | 'failed' | 'running';

export interface IExecutionItem {
  id: string;
  workflowName: string;
  workflowId: string;
  status: TExecutionStatus;
  startedAt: string;
  duration: string;
  triggeredBy: string;
  nodesExecuted: number;
}

const MOCK_EXECUTIONS: IExecutionItem[] = [
  {
    id: 'exec-9821',
    workflowName: 'Data Processing & Sync Pipeline',
    workflowId: 'wf-1',
    status: 'success',
    startedAt: '2026-09-14 18:24:10',
    duration: '1.4s',
    triggeredBy: 'Manual Trigger',
    nodesExecuted: 3,
  },
  {
    id: 'exec-9820',
    workflowName: 'Customer Onboarding Webhook',
    workflowId: 'wf-2',
    status: 'failed',
    startedAt: '2026-09-14 17:50:02',
    duration: '450ms',
    triggeredBy: 'Webhook',
    nodesExecuted: 2,
  },
  {
    id: 'exec-9819',
    workflowName: 'Hourly Database Backup',
    workflowId: 'wf-3',
    status: 'running',
    startedAt: '2026-09-14 18:28:45',
    duration: 'in progress...',
    triggeredBy: 'Cron Schedule',
    nodesExecuted: 1,
  },
  {
    id: 'exec-9818',
    workflowName: 'AI Text Summarization Pipeline',
    workflowId: 'wf-4',
    status: 'success',
    startedAt: '2026-09-14 16:12:33',
    duration: '4.8s',
    triggeredBy: 'Manual Trigger',
    nodesExecuted: 5,
  },
];

export const ExecutionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExec, setSelectedExec] = useState<IExecutionItem | null>(null);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const filteredExecutions = MOCK_EXECUTIONS.filter((exec) => {
    const matchesSearch =
      exec.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TExecutionStatus) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Success
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            <XCircle className="h-3.5 w-3.5" />
            Failed
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            Running
          </span>
        );
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col p-6 pt-20">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Executions</h1>
          <p className="text-muted-foreground text-xs">
            Monitor and inspect workflow runs, statuses, and execution logs.
          </p>
        </div>

        <AppButton
          text="Refresh"
          variant="secondary"
          size="xs"
          icon={RefreshCw}
          isPending={isLoading}
          pendingText="Refreshing..."
          onClick={handleRefresh}
        />
      </div>

      <div className="bg-card border-border mb-4 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by workflow name or execution ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border bg-muted/20 text-foreground focus:border-primary w-full rounded-md border py-1.5 pr-3 pl-9 text-xs outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Status:</span>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs bg-muted/20">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="running">Running</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rowCount={5} columnCount={8} />
      ) : (
        <div className="bg-card border-border overflow-hidden rounded-lg border shadow-xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[120px]">Execution ID</TableHead>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Nodes</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Started At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExecutions.length > 0 ? (
                  filteredExecutions.map((exec) => (
                    <TableRow
                      key={exec.id}
                      className="cursor-pointer transition-colors hover:bg-muted/20"
                      onClick={() => setSelectedExec(exec)}
                    >
                      <TableCell className="font-mono text-[11px] font-medium text-foreground/80">
                        {exec.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{exec.workflowName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {exec.workflowId}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(exec.status)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <PlayCircle className="h-3 w-3" />
                          {exec.triggeredBy}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono">
                        {exec.nodesExecuted} nodes
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-muted-foreground font-mono">
                          <Clock className="h-3 w-3" />
                          {exec.duration}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono">
                        {exec.startedAt}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <AppButton
                          variant="ghost"
                          size="xs"
                          icon={ExternalLink}
                          onClick={() => setSelectedExec(exec)}
                          className="h-7 w-7 p-0"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-muted-foreground py-8 text-center">
                      No executions found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="bg-muted/10 border-border flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredExecutions.length}</strong> of{' '}
              <strong className="text-foreground">{MOCK_EXECUTIONS.length}</strong> runs
            </span>
            <div className="flex items-center gap-1.5">
              <AppButton
                variant="regular"
                size="xs"
                icon={ChevronLeft}
                isDisabled
                className="h-7 w-7 p-0"
              />
              <span className="px-1">Page 1 of 1</span>
              <AppButton
                variant="regular"
                size="xs"
                icon={ChevronRight}
                isDisabled
                className="h-7 w-7 p-0"
              />
            </div>
          </div>
        </div>
      )}

      <Dialog open={Boolean(selectedExec)} onOpenChange={() => setSelectedExec(null)}>
        {selectedExec && (
          <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border bg-card">
            <DialogHeader
              title={`Execution Details — ${selectedExec.id}`}
              description="Full execution runtime log summary"
              icon={<Terminal className="h-4 w-4 text-primary" />}
              onClose={() => setSelectedExec(null)}
            />

            <DialogBody withBorder className="space-y-3 text-xs my-0 py-4">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Workflow Name:</span>
                <span className="font-medium">{selectedExec.workflowName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Status:</span>
                <span>{getStatusBadge(selectedExec.status)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Trigger Source:</span>
                <span>{selectedExec.triggeredBy}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Start Timestamp:</span>
                <span className="font-mono">{selectedExec.startedAt}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Total Duration:</span>
                <span className="font-mono">{selectedExec.duration}</span>
              </div>
            </DialogBody>

            <DialogFooter
              onCancel={() => setSelectedExec(null)}
              showSubmit={false}
              cancelText="Close"
            />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};