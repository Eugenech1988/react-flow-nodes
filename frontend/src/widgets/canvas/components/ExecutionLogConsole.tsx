import { Terminal, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Импортируем анимации
import { useStore } from '@/entities';
import { Button } from '@/shared/ui';

export const ExecutionLogConsole = () => {
  const logs = useStore((state) => state.logs);
  const status = useStore((state) => state.executionStatus);
  const clearLogs = useStore((state) => state.clearLogs);
  const stopWorkflow = useStore((state) => state.stopWorkflow);

  const isVisible = logs.length > 0 || status !== 'idle';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.98 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="absolute bottom-4 left-4 right-4 h-48 z-50 bg-[var(--header-bg)] border border-[var(--border)] rounded-[var(--radius)] shadow-xl flex flex-col overflow-hidden backdrop-blur-md select-none"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--accent)] text-[var(--foreground)]">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
              <Terminal className={`w-3.5 h-3.5 ${status === 'running' ? 'text-blue-500 animate-pulse' : ''}`} />
              Execution Logs
              {status === 'running' && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 animate-pulse">
                  running
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearLogs}
                className="w-7 h-7 text-[var(--muted-foreground)] hover:text-rose-500 transition-colors cursor-pointer rounded-md"
                title="Clear logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={stopWorkflow}
                className="w-7 h-7 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-[#030712]/40 dark:bg-[#000000]/20 scrollbar-thin">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`flex items-start gap-2 leading-relaxed transition-colors duration-150 py-0.5 px-1 rounded-sm hover:bg-[var(--accent)]/30 ${
                  log.type === 'error' ? 'text-rose-400 dark:text-rose-500 font-semibold' :
                    log.type === 'success' ? 'text-emerald-400 dark:text-emerald-500' : 'text-[var(--muted-foreground)]'
                }`}
              >
                <span className="opacity-40 select-none shrink-0">[{log.timestamp}]</span>
                <span className="break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};