import { useState } from 'react';
import { Terminal, Trash2, Square, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/entities';
import { Button } from '@/shared/ui';

export const ExecutionLogConsole = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const logs = useStore((state) => state.logs);
  const status = useStore((state) => state.executionStatus);
  const clearLogs = useStore((state) => state.clearLogs);
  const stopWorkflow = useStore((state) => state.stopWorkflow);

  const isVisible = logs.length > 0 || status !== 'idle';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            width: isMinimized ? '42px' : 'calc(100vw - 32px)',
            height: isMinimized ? '42px' : '192px',
          }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className={`absolute bottom-4 ${isMinimized ? 'left-12 ' : 'left-4'} z-50 bg-[var(--header-bg)] border border-[var(--border)] rounded-[var(--radius)] shadow-xl flex flex-col overflow-hidden backdrop-blur-md select-none`}
        >
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-full cursor-pointer flex items-center justify-center hover:bg-[var(--accent)] transition-colors"
              title="Expand logs"
            >
              <Terminal className="w-5 h-5 text-[var(--foreground)]" />
              {status === 'running' && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--node-output)] rounded-full animate-pulse" />
              )}
            </button>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--accent)] text-[var(--foreground)] shrink-0">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                  <Terminal className={`w-3.5 h-3.5 ${status === 'running' ? 'text-[var(--node-output)] animate-pulse' : ''}`} />
                  Execution Logs
                  {status === 'running' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[var(--node-output)]/10 text-[var(--node-output)] animate-pulse">
                      running
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5">
                  {status === 'running' && (
                    <Button variant="ghost" size="icon" onClick={stopWorkflow} className="w-7 h-7 text-[var(--node-math)] hover:bg-[var(--node-math)]/10 rounded-md" title="Stop">
                      <Square className="w-3 h-3 fill-current" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={clearLogs} className="w-7 h-7 text-[var(--muted-foreground)] hover:text-[var(--node-math)] rounded-md" title="Clear">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="w-7 h-7 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-md" title="Minimize">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-[var(--background)]/50 scrollbar-thin">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="opacity-40 text-[var(--foreground)]">[{log.timestamp}]</span>
                    <span className={
                      log.type === 'error' ? 'text-[var(--node-math)]' :
                        log.type === 'success' ? 'text-[var(--node-output)]' :
                          'text-[var(--foreground)]'
                    }>
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