import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Terminal
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@pipeline/ui';

import {
  AppButton,
  FloatingInput,
  Tabs,
  DialogBody,
  DialogFooter,
  DialogHeader,
  TableSkeleton
} from '@/shared/ui';
import { PAGE_VARIANTS } from '@/shared/lib';

export type TExecutionStatus = 'all' | 'success' | 'failed' | 'running';

export interface IExecutionItem {
  id: string;
  workflowName: string;
  workflowId: string;
  status: Exclude<TExecutionStatus, 'all'>;
  startedAt: string;
  duration: string;
  triggeredBy: string;
  nodesExecuted: number;
}

const EXECUTION_TABS = [
  { id: 'all', label: 'All Runs' },
  { id: 'success', label: 'Success' },
  { id: 'failed', label: 'Failed' },
  { id: 'running', label: 'Running' },
];

const MOCK_EXECUTIONS: IExecutionItem[] = [
  {
    id: 'exec-9821',
    workflowName: 'Data Processing & Sync Pipeline',
    workflowId: 'wf-1',
    status: 'success',
    startedAt: '2026-09-14 18:24:10',
    duration: '1.4s',
    triggeredBy: 'Manual Trigger',
    nodesExecuted: 3
  },
  {
    id: 'exec-9820',
    workflowName: 'Customer Onboarding Webhook',
    workflowId: 'wf-2',
    status: 'failed',
    startedAt: '2026-09-14 17:50:02',
    duration: '450ms',
    triggeredBy: 'Webhook',
    nodesExecuted: 2
  },
  {
    id: 'exec-9819',
    workflowName: 'Hourly Database Backup',
    workflowId: 'wf-3',
    status: 'running',
    startedAt: '2026-09-14 18:28:45',
    duration: 'in progress...',
    triggeredBy: 'Cron Schedule',
    nodesExecuted: 1
  },
  {
    id: 'exec-9818',
    workflowName: 'AI Text Summarization Pipeline',
    workflowId: 'wf-4',
    status: 'success',
    startedAt: '2026-09-14 16:12:33',
    duration: '4.8s',
    triggeredBy: 'Manual Trigger',
    nodesExecuted: 5
  }
];

export const ExecutionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TExecutionStatus>('all');
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

  const getStatusBadge = (status: Exclude<TExecutionStatus, 'all'>) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Paid / Success
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">
            <XCircle className="h-3 w-3" />
            Failed
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Running
          </span>
        );
    }
  };

  return (
    <motion.div
      className="bg-background text-foreground p-4 md:p-6 transition-colors duration-300"
      variants={PAGE_VARIANTS}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Executions</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Monitor, inspect, and audit real-time workflow runs and execution logs.
            </p>
          </div>

          <AppButton
            variant="secondary"
            size="md"
            text="Refresh Logs"
            icon={RefreshCw}
            isPending={isLoading}
            pendingText="Refreshing..."
            onClick={handleRefresh}
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80 group">
            <FloatingInput
              rounded="xl"
              label="Search executions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Tabs
              tabs={EXECUTION_TABS}
              layoutId="executions-filter-tabs"
              currentTab={statusFilter}
              onTabChange={(id) => setStatusFilter(id as TExecutionStatus)}
            />
          </div>
        </div>

        {/* Table / Content Section */}
        {isLoading ? (
          <TableSkeleton rowCount={5} columnCount={8} />
        ) : (
          <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border/60 bg-muted/30">
                    <TableHead className="font-semibold text-muted-foreground py-3 pl-4">
                      Execution ID
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-3">
                      Workflow
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-3">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-3">
                      Trigger
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-3">
                      Nodes
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-3">
                      Duration
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground py-3">
                      Started At
                    </TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground py-3 pr-4">
                      Details
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExecutions.length > 0 ? (
                    filteredExecutions.map((exec) => (
                      <TableRow
                        key={exec.id}
                        className="hover:bg-muted/30 border-b border-border/40 transition-colors cursor-pointer"
                        onClick={() => setSelectedExec(exec)}
                      >
                        <TableCell className="font-mono text-[11px] font-medium py-3 pl-4 text-foreground">
                          {exec.id}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="font-medium text-foreground">{exec.workflowName}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {exec.workflowId}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">{getStatusBadge(exec.status)}</TableCell>
                        <TableCell className="py-3">
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground text-[11px]">
                            <PlayCircle className="h-3 w-3" />
                            {exec.triggeredBy}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-muted-foreground font-mono text-[11px]">
                          {exec.nodesExecuted} nodes
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="inline-flex items-center gap-1 text-muted-foreground font-mono text-[11px]">
                            <Clock className="h-3 w-3" />
                            {exec.duration}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-muted-foreground font-mono text-[11px]">
                          {exec.startedAt}
                        </TableCell>
                        <TableCell
                          className="text-right py-3 pr-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <AppButton
                            variant="ghost"
                            size="xs"
                            icon={ExternalLink}
                            text="Inspect"
                            onClick={() => setSelectedExec(exec)}
                            className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 p-0 h-auto min-h-0 border-none text-xs"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                        No executions found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="bg-muted/10 border-t border-border/60 flex items-center justify-between px-4 py-3 text-xs text-muted-foreground">
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
                  className="h-7 w-7 p-0 rounded-md"
                />
                <span className="px-1 text-[11px]">Page 1 of 1</span>
                <AppButton
                  variant="regular"
                  size="xs"
                  icon={ChevronRight}
                  isDisabled
                  className="h-7 w-7 p-0 rounded-md"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Execution Details Modal */}
      <Dialog open={Boolean(selectedExec)} onOpenChange={() => setSelectedExec(null)}>
        {selectedExec && (
          <DialogContent showCloseButton={false} className="sm:max-w-md p-0 gap-0 overflow-hidden border-border bg-card rounded-2xl">
            <DialogHeader
              title={`Execution Details — ${selectedExec.id}`}
              description="Full execution runtime log summary"
              icon={<Terminal className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
              onClose={() => setSelectedExec(null)}
            />

            <DialogBody withBorder className="text-sm my-0 border-0 py-0">
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Workflow Name:</span>
                <span className="font-medium">{selectedExec.workflowName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Status:</span>
                <span>{getStatusBadge(selectedExec.status)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Trigger Source:</span>
                <span>{selectedExec.triggeredBy}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Start Timestamp:</span>
                <span className="font-mono">{selectedExec.startedAt}</span>
              </div>
              <div className="flex justify-between py-2">
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
    </motion.div>
  );
};