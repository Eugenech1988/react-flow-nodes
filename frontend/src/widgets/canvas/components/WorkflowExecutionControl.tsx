import { Play, Square, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '@/entities';
import { Button } from '@/shared/ui';
import type { ExecutionStatus } from '@/entities';

export const WorkflowExecutionControl = () => {
  const status = useStore((state) => state.executionStatus);
  const runWorkflow = useStore((state) => state.runWorkflow);
  const stopWorkflow = useStore((state) => state.stopWorkflow);

  if (status === 'running') {
    return (
      <Button
        variant="destructive"
        size="sm"
        onClick={stopWorkflow}
        className="absolute top-4 left-[50%] translate-x-[-50%] z-50 h-8 px-3.5 text-xs font-medium rounded-[var(--radius)] shadow-sm transition-all duration-300 cursor-pointer select-none gap-1.5"
      >
        <Square className="w-3.5 h-3.5 fill-current animate-pulse" />
        Stop
      </Button>
    );
  }

  const getButtonConfig = (status: ExecutionStatus) => {
    switch (status) {
      case 'success':
        return {
          text: 'Success / Run',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          className: 'absolute top-4 z-50 left-[50%] translate-x-[-50%] bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600',
        };
      case 'failed':
        return {
          text: 'Failed / Retry',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          className: 'absolute top-4 z-50 left-[50%] translate-x-[-50%] bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-700 dark:hover:bg-rose-600',
        };
      case 'idle':
      default:
        return {
          text: 'Run',
          icon: <Play className="w-3.5 h-3.5 fill-current" />,
          className: 'absolute top-4 z-50  translate-x-[-50%] bg-[var(--foreground)] text-[var(--background)] hover:opacity-90',
        };
    }
  };

  const config = getButtonConfig(status);

  return (
    <Button
      variant="default"
      size="sm"
      onClick={runWorkflow}
      className={`h-8 px-3.5 text-xs absolute top-4 left-[50%] translate-x-[-50%] z-50 font-semibold rounded-[var(--radius)] shadow-sm transition-all duration-300 border border-transparent cursor-pointer select-none gap-1.5 ${config.className}`}
    >
      {config.icon}
      {config.text}
    </Button>
  );
};