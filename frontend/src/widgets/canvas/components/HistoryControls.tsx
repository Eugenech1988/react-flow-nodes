import { useStore } from '@/entities';
import { Undo, Redo } from 'lucide-react';

export const HistoryControls = () => {
  const past = useStore((state) => state.past);
  const future = useStore((state) => state.future);
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);

  return (
    <div className="absolute top-4 left-4 z-10 flex bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] shadow-md overflow-hidden">
      <button
        onClick={undo}
        disabled={past.length === 0}
        className="p-2 text-[var(--card-foreground)] cursor-pointer hover:bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Undo size={16} />
      </button>
      <button
        onClick={redo}
        disabled={future.length === 0}
        className="p-2 text-[var(--card-foreground)] cursor-pointer hover:bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-l border-[var(--border)]"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};