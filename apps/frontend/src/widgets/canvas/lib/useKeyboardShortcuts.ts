import { useEffect } from 'react';
import type { PipelineNode, PipelineEdge } from '@/entities';
import { toast } from 'sonner';

interface UseKeyboardShortcutsParams {
  copyNodes: (nodes: PipelineNode[], edges: PipelineEdge[]) => void;
  pasteNodes: () => void;
  getNodes: () => PipelineNode[];
  getEdges: () => PipelineEdge[];
  undo: () => void;
  redo: () => void;
}

export const useKeyboardShortcuts = ({
                                       copyNodes,
                                       pasteNodes,
                                       getNodes,
                                       getEdges,
                                       undo,
                                       redo,
                                     }: UseKeyboardShortcutsParams) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      if (modifier && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        const selected = getNodes().filter((n) => n.selected);
        if (selected.length > 0) {
          copyNodes(selected, getEdges());
          toast.success('Nodes copied', {
            duration: 2000,
          });
        }
      }

      if (modifier && event.key.toLowerCase() === 'v') {
        event.preventDefault();
        pasteNodes();
      }

      if (modifier && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if (modifier && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [copyNodes, pasteNodes, getNodes, getEdges, undo, redo]);
};