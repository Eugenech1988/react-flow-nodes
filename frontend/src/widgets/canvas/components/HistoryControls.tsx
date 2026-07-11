import { Undo2, Redo2 } from 'lucide-react';
import { useStore } from '@/entities/pipeline';
import { Button } from '@/shared/ui';

export const HistoryControls = () => {
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const canUndo = useStore((state) => state.past.length > 0);
  const canRedo = useStore((state) => state.future.length > 0);

  return (
    <div className="absolute top-4 left-4 z-50 flex gap-1 p-1 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] shadow-sm backdrop-blur-xs select-none">
      <Button
        variant="ghost"
        size="sm"
        onClick={undo}
        disabled={!canUndo}
        className="h-8 px-2.5 text-xs font-medium gap-1.5 cursor-pointer transition-colors duration-300 rounded-md
          text-[var(--foreground)]
          hover:bg-[var(--accent)]
          disabled:opacity-30 disabled:cursor-not-allowed"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-3.5 h-3.5" />
        Undo
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={redo}
        disabled={!canRedo}
        className="h-8 px-2.5 text-xs font-medium gap-1.5 cursor-pointer transition-colors duration-300 rounded-md
          text-[var(--foreground)]
          hover:bg-[var(--accent)]
          disabled:opacity-30 disabled:cursor-not-allowed"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-3.5 h-3.5" />
        Redo
      </Button>
    </div>
  );
};