import { useStore } from '@/entities';
import { Button, Dialog } from '@/shared';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export const ClearCanvasButton = () => {
  const clearCanvas = useStore((state) => state.clearCanvas);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Clear Canvas"
        className="absolute left-34 top-4 z-50 w-8.5 h-8.5 flex items-center justify-center cursor-pointer transition-all duration-200 bg-[var(--card)] border border-[var(--border)] text-[var(--node-math)] rounded-[var(--radius)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:bg-[var(--node-math)] hover:text-white"
      >
        <Trash2 size={18}/>
      </button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Clear Canvas"
        className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)]"
      >
        <div className="flex flex-col gap-5 p-1 text-[var(--card-foreground)]">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-[var(--card-foreground)]">
              Are you sure you want to clear the canvas?
            </p>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              This will remove all nodes and connections. You can undo this action if needed.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-[var(--radius)] border-[var(--border)]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearCanvas();
                setIsOpen(false);
              }}
              className="rounded-[var(--radius)] bg-[var(--node-math)] text-white hover:opacity-90"
            >
              Clear Canvas
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};