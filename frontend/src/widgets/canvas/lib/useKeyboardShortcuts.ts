import { useEffect } from 'react';
import type { PipelineNode, PipelineEdge } from '@/entities';
import { useStore } from '@/entities';

interface UseKeyboardShortcutsParams {
  copyNodes: (nodes: PipelineNode[], edges: PipelineEdge[]) => void;
  pasteNodes: () => void;
  getNodes: () => PipelineNode[];
  getEdges: () => PipelineEdge[];
}

export const useKeyboardShortcuts = ({
                                       copyNodes,
                                       pasteNodes,
                                       getNodes,
                                       getEdges,
                                     }: UseKeyboardShortcutsParams) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      if (modifier && event.key.toLowerCase() === 'c') {
        const selected = getNodes().filter((n) => n.selected);
        if (selected.length > 0) {
          copyNodes(selected, getEdges());
        }
      }

      if (modifier && event.key.toLowerCase() === 'v') {
        event.preventDefault();
        pasteNodes();
      }

      if (modifier && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          useStore.getState().redo();
        } else {
          useStore.getState().undo();
        }
      }

      if (modifier && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        useStore.getState().redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [copyNodes, pasteNodes, getNodes, getEdges]);
};