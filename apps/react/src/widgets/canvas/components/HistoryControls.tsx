import { Undo, Redo } from 'lucide-react';
import { useStore } from '@/entities';

export const HistoryControls = () => {
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const canUndo = useStore((state) => state.past.length > 0);
  const canRedo = useStore((state) => state.future.length > 0);

  return (
    <div className="absolute top-4 left-4 z-10 flex overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] shadow-md">
      <button
        onClick={() => undo()}
        disabled={!canUndo}
        aria-label="Undo"
        title="Undo"
        className="cursor-pointer p-2 text-[var(--card-foreground)] transition-colors hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Undo size={16} />
      </button>
      <button
        onClick={() => redo()}
        disabled={!canRedo}
        aria-label="Redo"
        title="Redo"
        className="cursor-pointer border-l border-[var(--border)] p-2 text-[var(--card-foreground)] transition-colors hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};
