import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TPipelineNode, TPipelineEdge } from '@/entities';
import { useKeyboardShortcuts, isInputElement } from './useKeyboardShortcuts';

const { mockToastSuccess } = vi.hoisted(() => ({
  mockToastSuccess: vi.fn<(message: string, opts?: { duration?: number }) => void>(),
}));

vi.mock('sonner', () => ({
  toast: { success: mockToastSuccess },
}));

describe('isInputElement helper', () => {
  it('returns true for text input, textarea, and select elements', () => {
    const input = document.createElement('input');
    input.type = 'text';
    expect(isInputElement(input)).toBe(true);

    const textarea = document.createElement('textarea');
    expect(isInputElement(textarea)).toBe(true);

    const select = document.createElement('select');
    expect(isInputElement(select)).toBe(true);
  });

  it('returns false for non-text inputs', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    expect(isInputElement(checkbox)).toBe(false);

    const button = document.createElement('input');
    button.type = 'button';
    expect(isInputElement(button)).toBe(false);
  });

  it('returns true for contenteditable elements', () => {
    const div = document.createElement('div');
    div.contentEditable = 'true';
    expect(isInputElement(div)).toBe(true);
  });

  it('returns false for generic container elements', () => {
    const div = document.createElement('div');
    expect(isInputElement(div)).toBe(false);
  });
});

describe('useKeyboardShortcuts hook', () => {
  const copyNodes = vi.fn<(nodes: TPipelineNode[], edges: TPipelineEdge[]) => void>();
  const pasteNodes = vi.fn<() => void>();
  const getNodes = vi.fn<() => TPipelineNode[]>(() => []);
  const getEdges = vi.fn<() => TPipelineEdge[]>(() => []);
  const undo = vi.fn<() => void>();
  const redo = vi.fn<() => void>();

  const mockParams = {
    copyNodes,
    pasteNodes,
    getNodes,
    getEdges,
    undo,
    redo,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    getNodes.mockReturnValue([]);
    getEdges.mockReturnValue([]);
  });

  it('copies selected nodes on Ctrl/Cmd+C when focus is outside text input', () => {
    const mockNode: TPipelineNode = {
      id: 'node-1',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {},
      selected: true,
    };
    getNodes.mockReturnValue([mockNode]);

    renderHook(() => useKeyboardShortcuts(mockParams));

    const event = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(copyNodes).toHaveBeenCalledWith([mockNode], []);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('shows toast after copying', () => {
    const mockNode: TPipelineNode = {
      id: 'node-1',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {},
      selected: true,
    };
    getNodes.mockReturnValue([mockNode]);

    renderHook(() => useKeyboardShortcuts(mockParams));

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true }),
    );

    expect(mockToastSuccess).toHaveBeenCalledWith('Nodes copied', { duration: 2000 });
  });

  it('does not copy when no nodes are selected', () => {
    getNodes.mockReturnValue([]);

    renderHook(() => useKeyboardShortcuts(mockParams));

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true }),
    );

    expect(copyNodes).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it('does NOT copy nodes on Ctrl/Cmd+C if focus is inside text input', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const mockNode: TPipelineNode = {
      id: 'node-1',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {},
      selected: true,
    };
    getNodes.mockReturnValue([mockNode]);

    renderHook(() => useKeyboardShortcuts(mockParams));

    const event = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    input.dispatchEvent(event);

    expect(copyNodes).not.toHaveBeenCalled();
    expect(preventDefaultSpy).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('pastes nodes on Ctrl/Cmd+V when focus is outside text input', () => {
    renderHook(() => useKeyboardShortcuts(mockParams));

    const event = new KeyboardEvent('keydown', {
      key: 'v',
      ctrlKey: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(pasteNodes).toHaveBeenCalled();
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('does NOT paste nodes on Ctrl/Cmd+V if focus is inside text input', () => {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();

    renderHook(() => useKeyboardShortcuts(mockParams));

    const event = new KeyboardEvent('keydown', {
      key: 'v',
      ctrlKey: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    textarea.dispatchEvent(event);

    expect(pasteNodes).not.toHaveBeenCalled();
    expect(preventDefaultSpy).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  it('undoes on Ctrl/Cmd+Z', () => {
    renderHook(() => useKeyboardShortcuts(mockParams));

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }),
    );

    expect(undo).toHaveBeenCalledTimes(1);
    expect(redo).not.toHaveBeenCalled();
  });

  it('redoes on Ctrl/Cmd+Shift+Z', () => {
    renderHook(() => useKeyboardShortcuts(mockParams));

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      }),
    );

    expect(redo).toHaveBeenCalledTimes(1);
    expect(undo).not.toHaveBeenCalled();
  });

  it('redoes on Ctrl/Cmd+Y', () => {
    renderHook(() => useKeyboardShortcuts(mockParams));

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, bubbles: true }),
    );

    expect(redo).toHaveBeenCalledTimes(1);
  });
});
