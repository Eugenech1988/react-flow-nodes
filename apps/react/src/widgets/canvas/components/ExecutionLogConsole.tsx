import { useState } from 'react';
import { Terminal, Trash2, Square, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/entities';
import { Button } from '@pipeline/ui';

export const ExecutionLogConsole = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const logs = useStore((state) => state.logs);
  const status = useStore((state) => state.executionStatus);
  const clearLogs = useStore((state) => state.clearLogs);
  const stopWorkflow = useStore((state) => state.stopWorkflow);

  const isVisible = logs.length > 0 || status !== 'idle';

  const getHeaderColor = () => {
    if (status === 'failed') return 'text-[var(--node-math)]';
    if (status === 'running') return 'text-[var(--node-output)]';
    return 'text-[var(--foreground)]';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            width: isMinimized ? '40px' : 'calc(100% - 32px)',
            height: isMinimized ? '40px' : '192px',
          }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className={`absolute bottom-4 ${isMinimized ? 'left-14' : 'left-4'} z-40 flex flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--header-bg)] shadow-xl backdrop-blur-md select-none`}
        >
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className="flex h-full w-full cursor-pointer items-center justify-center transition-colors hover:bg-[var(--accent)]"
              title="Expand logs"
            >
              {status === 'failed' ? (
                <AlertCircle className="h-5 w-5 text-[var(--node-math)]" />
              ) : (
                <Terminal className="h-5 w-5 text-[var(--foreground)]" />
              )}
              {status === 'running' && (
                <span className="absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full bg-[var(--node-output)]" />
              )}
            </button>
          ) : (
            <>
              <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-[var(--foreground)]">
                <div
                  className={`flex items-center gap-2 text-xs font-semibold tracking-wide ${getHeaderColor()}`}
                >
                  {status === 'failed' ? (
                    <AlertCircle className="h-3.5 w-3.5" />
                  ) : (
                    <Terminal className="h-3.5 w-3.5" />
                  )}
                  Execution Logs
                  {status === 'running' && (
                    <span className="inline-flex animate-pulse items-center rounded-full bg-[var(--node-output)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--node-output)]">
                      running
                    </span>
                  )}
                  {status === 'failed' && (
                    <span className="inline-flex items-center rounded-full bg-[var(--node-math)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--node-math)]">
                      failed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5">
                  {status === 'running' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={stopWorkflow}
                      className="h-7 w-7 rounded-md text-[var(--node-math)] hover:bg-[var(--node-math)]/10"
                      title="Stop"
                    >
                      <Square className="h-3 w-3 fill-current" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearLogs}
                    className="h-7 w-7 rounded-md text-[var(--muted-foreground)] hover:text-[var(--node-math)]"
                    title="Clear"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(true)}
                    className="h-7 w-7 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    title="Minimize"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 scrollbar-thin space-y-1.5 overflow-y-auto bg-[var(--background)]/50 p-3 font-mono text-[11px]">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[var(--foreground)] opacity-40">[{log.timestamp}]</span>
                    <span
                      className={
                        log.type === 'error'
                          ? 'text-[var(--node-math)]'
                          : log.type === 'success'
                            ? 'text-[var(--node-output)]'
                            : 'text-[var(--foreground)]'
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
