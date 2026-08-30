import { useEffect } from 'react';
import { Play, Square, CheckCircle2, AlertCircle } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/entities';
import { Button } from '@pipeline/ui';
import type { TExecutionStatus } from '@/entities';

export const WorkflowExecutionControl = () => {
  const { setNodes, setEdges } = useReactFlow();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const status = useStore((state) => state.executionStatus);
  const runWorkflow = useStore((state) => state.runWorkflow);
  const stopWorkflow = useStore((state) => state.stopWorkflow);
  const setLastRunInfo = useStore((state) => state.setLastRunInfo);

  useEffect(() => {
    if (status === 'running') {
      setLastRunInfo('RUNNING', new Date());
    } else if (status === 'success') {
      setLastRunInfo('SUCCESS', new Date());
    } else if (status === 'failed') {
      setLastRunInfo('FAILED', new Date());
    }
  }, [status, setLastRunInfo]);

  const handleStartFlow = () => {
    if (!isHome) {
      navigate('/');
    }

    setNodes((nodes) => nodes.map((n) => ({ ...n, selected: false })));
    setEdges((edges) => edges.map((e) => ({ ...e, selected: false })));
    runWorkflow();
  };

  const getRunButtonConfig = (status: TExecutionStatus) => {
    switch (status) {
      case 'running':
        return {
          text: 'Stop',
          icon: <Square className="h-3.5 w-3.5 animate-pulse fill-current" />,
          className:
            'border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15 active:scale-95',
          onClick: stopWorkflow,
        };
      case 'success':
        return {
          text: 'Restart',
          icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
          className:
            'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400 active:scale-95',
          onClick: handleStartFlow,
        };
      case 'failed':
        return {
          text: 'Retry',
          icon: <AlertCircle className="text-destructive h-3.5 w-3.5" />,
          className:
            'border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15 active:scale-95',
          onClick: handleStartFlow,
        };
      default:
        return {
          text: 'Start',
          icon: <Play className="h-3.5 w-3.5 fill-current" />,
          className:
            'border border-primary bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-sm',
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
      aria-label={`${config.text} workflow`}
      className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-all ${config.className}`}
    >
      {config.icon}
      {config.text}
    </Button>
  );
};
