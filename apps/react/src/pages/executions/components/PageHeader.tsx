import { History, RefreshCw } from 'lucide-react';
import { AppButton } from '@/shared/ui';
import { useExecutions } from '@/shared/hooks/useExecutions';

export const PageHeader = () => {
  const {refetch, isFetching} = useExecutions();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <History className="w-6 h-6 text-teal-600 dark:text-teal-400"/>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Executions
          </h1>
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
        isPending={isFetching}
        pendingText="Refreshing..."
        onClick={() => refetch()}
      />
    </div>
  );
};