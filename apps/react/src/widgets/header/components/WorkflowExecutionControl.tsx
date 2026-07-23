import { Play, Square, CheckCircle2, AlertCircle } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/entities';
import { Button } from '@pipeline/ui';
import type { ExecutionStatus } from '@/entities';

export const WorkflowExecutionControl = () => {
  const { setNodes, setEdges } = useReactFlow();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const status = useStore((state) => state.executionStatus);
  const runWorkflow = useStore((state) => state.runWorkflow);
  const stopWorkflow = useStore((state) => state.stopWorkflow);

  const handleStartFlow = () => {
    if (!isHome) {
      navigate('/');
    }

    setNodes((nodes) => nodes.map((n) => ({ ...n, selected: false })));
    setEdges((edges) => edges.map((e) => ({ ...e, selected: false })));
    runWorkflow();
  };

  const getRunButtonConfig = (status: ExecutionStatus) => {
    switch (status) {
      case 'running':
        return {
          text: 'Stop',
          icon: <Square className="w-3.5 h-3.5 fill-current animate-pulse" />,
          className: 'bg-[var(--node-math)] text-white hover:opacity-90 active:scale-95 shadow-sm',
          onClick: stopWorkflow, // Остановку можно выполнять со страницы редактора
        };
      case 'success':
        return {
          text: 'Success',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-[var(--node-output)]" />,
          className: 'bg-[var(--node-output)]/10 border border-[var(--node-output)]/30 text-[var(--node-output)] hover:bg-[var(--node-output)]/20 shadow-xs',
          onClick: handleStartFlow,
        };
      case 'failed':
        return {
          text: 'Failed',
          icon: <AlertCircle className="w-3.5 h-3.5 text-[var(--node-math)]" />,
          className: 'bg-[var(--node-math)]/10 border border-[var(--node-math)]/30 text-[var(--node-math)] hover:bg-[var(--node-math)]/20 shadow-xs',
          onClick: handleStartFlow,
        };
      default:
        return {
          text: 'Run',
          icon: <Play className="w-3.5 h-3.5 fill-current" />,
          className: 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 active:scale-95 shadow-sm',
          onClick: handleStartFlow,
        };
    }
  };

  const config = getRunButtonConfig(status);

  return (
    <Button
      variant="default"
      size="sm"
      onClick={config.onClick}
      className={`flex items-center gap-1.5 px-3 h-8 text-xs font-semibold rounded-md cursor-pointer transition-all ${config.className}`}
    >
      {config.icon}
      {config.text}
    </Button>
  );
};