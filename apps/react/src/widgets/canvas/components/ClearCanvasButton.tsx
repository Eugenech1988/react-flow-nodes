import { useState } from 'react';
import { useStore } from '@/entities';
import { Button, DialogClose } from '@pipeline/ui';
import { Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@pipeline/ui';

export const ClearCanvasButton = () => {
  const clearCanvas = useStore((state) => state.clearCanvas);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Clear Canvas"
        className="absolute left-34 top-4 z-40 w-8.5 h-8.5 flex items-center justify-center cursor-pointer transition-all duration-200 bg-[var(--card)] border border-[var(--border)] text-[var(--node-math)] rounded-[var(--radius)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:bg-[var(--node-math)] hover:text-white"
      >
        <Trash2 size={18} />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md p-6 gap-6 rounded-[28px]">
          <DialogClose className="cursor-pointer absolute right-4 top-4 rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 hover:bg-[var(--secondary)] focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader className="gap-4">
            <DialogTitle className="text-xl flex items-center gap-2">
              Clear Canvas
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Are you sure you want to clear the canvas? This will remove all nodes and connections.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 bg-transparent">
            <Button
              variant="secondary"
              className="rounded-full px-8 py-5"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full px-8 py-5 bg-[var(--node-math)] text-white hover:bg-[var(--node-math)]/90"
              onClick={() => {
                clearCanvas();
                setIsOpen(false);
              }}
            >
              Clear Canvas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};