import { useStore } from '@/entities/pipeline';

export const HistoryControls = () => {
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const canUndo = useStore((state) => state.past.length > 0);
  const canRedo = useStore((state) => state.future.length > 0);

  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2 p-1.5 bg-(--card) border border-(--border) rounded-xl shadow-sm">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-(--border) bg-(--background) text-(--foreground) shadow-xs hover:bg-(--secondary) disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
      >
        ⤺ Undo
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-(--border) bg-(--background) text-(--foreground) shadow-xs hover:bg-(--secondary) disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
      >
        ⤻ Redo
      </button>
    </div>
  );
};