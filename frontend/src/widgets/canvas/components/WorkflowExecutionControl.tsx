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
        className="absolute top-4 left-[50%] translate-x-[-50%] z-50 h-8 px-3.5 text-xs font-medium rounded-[var(--radius)] shadow-md transition-all duration-300 cursor-pointer select-none gap-1.5
                   bg-[var(--node-math)] text-white hover:opacity-90"
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
          text: 'Success',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          className: 'bg-[var(--node-output)] text-[var(--background)]',
        };
      case 'failed':
        return {
          text: 'Failed',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          className: 'bg-[var(--node-math)] text-[var(--background)]',
        };
      default:
        return {
          text: 'Run',
          icon: <Play className="w-3.5 h-3.5 fill-current" />,
          // Здесь цвета инвертируются при переключении темы:
          className: 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90',
        };
    }
  };

  const config = getButtonConfig(status);

  return (
    <Button
      variant="default"
      size="sm"
      onClick={runWorkflow}
      className={`absolute top-4 left-[50%] translate-x-[-50%] z-50 h-8 px-3.5 text-xs font-semibold rounded-[var(--radius)] shadow-md transition-all duration-300 cursor-pointer select-none gap-1.5 border-none ${config.className}`}
    >
      {config.icon}
      {config.text}
    </Button>
  );
};