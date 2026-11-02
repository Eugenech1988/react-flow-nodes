import { History, RefreshCw } from 'lucide-react';
import { AppButton } from '@/shared/ui';

interface IPageHeaderProps {
  isFetching?: boolean;
  handleRefresh: () => void;
}

export const PageHeader = ({ isFetching, handleRefresh }: IPageHeaderProps) => {
  return (
    <div className="border-border/60 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Executions</h1>
        </div>
        <p className="text-muted-foreground text-sm">
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
        onClick={() => handleRefresh()}
      />
    </div>
  );
};
