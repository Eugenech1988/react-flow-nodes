import { useCallback, useEffect, useState } from 'react';

const HEALTH_ENDPOINT = 'http://localhost:8000/health';

type ServerStatus = 'checking' | 'online' | 'offline';

const statusLabels: Record<ServerStatus, string> = {
  checking: 'Checking backend…',
  online: 'Backend online',
  offline: 'Backend offline',
};

export const ServerStatusBadge = () => {
  const [status, setStatus] = useState<ServerStatus>('checking');

  const checkServerStatus = useCallback(async () => {
    setStatus('checking');
    try {
      const response = await fetch(HEALTH_ENDPOINT);
      setStatus(response.ok ? 'online' : 'offline');
    } catch {
      setStatus('offline');
    }
  }, []);

  useEffect(() => {
    checkServerStatus();
  }, [checkServerStatus]);

  return (
    <button
      onClick={checkServerStatus}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:border-muted-foreground/45 transition-colors cursor-pointer select-none"
    >
      <span
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          status === 'online'
            ? 'bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500/0.6)]'
            : status === 'offline'
            ? 'bg-rose-500 shadow-[0_0_6px_theme(colors.rose.500/0.6)]'
            : 'bg-amber-500 animate-pulse'
        }`}
      />
      <span>{statusLabels[status]}</span>
    </button>
  );
};
