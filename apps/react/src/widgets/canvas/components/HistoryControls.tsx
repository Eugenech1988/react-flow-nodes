import { Undo, Redo } from 'lucide-react';
import { useStore } from '@/entities';

export const HistoryControls = () => {
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const canUndo = useStore((state) => state.past.length > 0);
  const canRedo = useStore((state) => state.future.length > 0);

  return (
    <div className="absolute top-4 left-4 z-10 flex bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] shadow-md overflow-hidden">
      <button
        onClick={() => undo()}
        disabled={!canUndo}
        aria-label="Undo"
        title="Undo"
        className="p-2 text-[var(--card-foreground)] cursor-pointer hover:bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Undo size={16} />
      </button>
      <button
        onClick={() => redo()}
        disabled={!canRedo}
        aria-label="Redo"
        title="Redo"
        className="p-2 text-[var(--card-foreground)] cursor-pointer hover:bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-l border-[var(--border)]"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};