import { useEffect } from 'react';
import type { TPipelineNode, TPipelineEdge } from '@/entities';
import { toast } from 'sonner';

interface UseKeyboardShortcutsParams {
  copyNodes: (nodes: TPipelineNode[], edges: TPipelineEdge[]) => void;
  pasteNodes: () => void;
  getNodes: () => TPipelineNode[];
  getEdges: () => TPipelineEdge[];
  undo: () => void;
  redo: () => void;
}

export const isInputElement = (element: Element | null): boolean => {
  if (!element) return false;
  const tagName = element.tagName;
  if (tagName === 'INPUT') {
    const inputType = (element as HTMLInputElement).type;
    const nonTextInputs = ['checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'image', 'range', 'color'];
    return !nonTextInputs.includes(inputType);
  }
  if (tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true;
  }
  const htmlEl = element as HTMLElement;
  const contentEditableAttr = element.getAttribute ? element.getAttribute('contenteditable') : null;
  if (
    htmlEl.isContentEditable ||
    htmlEl.contentEditable === 'true' ||
    (contentEditableAttr !== null && contentEditableAttr !== 'false')
  ) {
    return true;
  }
  return !!(element.closest && element.closest('[contenteditable="true"], [contenteditable=""]'));

};

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
      const target = event.target as Element | null;
      const activeElement = document.activeElement;

      if (isInputElement(target) || isInputElement(activeElement)) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      if (modifier && event.key.toLowerCase() === 'c') {
        const selected = getNodes().filter((n) => n.selected);
        if (selected.length > 0) {
          event.preventDefault();
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