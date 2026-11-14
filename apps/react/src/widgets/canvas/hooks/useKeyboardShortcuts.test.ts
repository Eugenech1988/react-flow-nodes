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

interface IKeyboardParams {
  copyNodes: (nodes: TPipelineNode[], edges: TPipelineEdge[]) => void;
  pasteNodes: () => void;
  getNodes: () => TPipelineNode[];
  getEdges: () => TPipelineEdge[];
  undo: () => void;
  redo: () => void;
}

const createParams = (): IKeyboardParams => ({
  copyNodes: vi.fn<(nodes: TPipelineNode[], edges: TPipelineEdge[]) => void>(),
  pasteNodes: vi.fn<() => void>(),
  getNodes: vi.fn<() => TPipelineNode[]>(() => []),
  getEdges: vi.fn<() => TPipelineEdge[]>(() => []),
  undo: vi.fn<() => void>(),
  redo: vi.fn<() => void>(),
});

const makeSelectedNode = (): TPipelineNode => ({
  id: 'node-1',
  type: 'custom',
  position: { x: 0, y: 0 },
  data: {},
  selected: true,
});

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('copies selected nodes on Ctrl/Cmd+C', () => {
    const params = createParams();
    const mockNode = makeSelectedNode();
    (params.getNodes as ReturnType<typeof vi.fn>).mockReturnValue([mockNode]);

    renderHook(() => useKeyboardShortcuts(params));

    const event = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(params.copyNodes).toHaveBeenCalledWith([mockNode], []);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('shows toast after copying', () => {
    const params = createParams();
    (params.getNodes as ReturnType<typeof vi.fn>).mockReturnValue([makeSelectedNode()]);

    renderHook(() => useKeyboardShortcuts(params));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true }));

    expect(mockToastSuccess).toHaveBeenCalledWith('Nodes copied', { duration: 2000 });
  });

  it('does not copy when no nodes are selected', () => {
    const params = createParams();

    renderHook(() => useKeyboardShortcuts(params));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true }));

    expect(params.copyNodes).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it('does NOT copy nodes on Ctrl/Cmd+C if focus is inside text input', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const params = createParams();
    (params.getNodes as ReturnType<typeof vi.fn>).mockReturnValue([makeSelectedNode()]);

    renderHook(() => useKeyboardShortcuts(params));

    const event = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    input.dispatchEvent(event);

    expect(params.copyNodes).not.toHaveBeenCalled();
    expect(preventDefaultSpy).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('pastes nodes on Ctrl/Cmd+V', () => {
    const params = createParams();

    renderHook(() => useKeyboardShortcuts(params));

    const event = new KeyboardEvent('keydown', {
      key: 'v',
      ctrlKey: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(params.pasteNodes).toHaveBeenCalled();
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('does NOT paste nodes on Ctrl/Cmd+V if focus is inside text input', () => {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();

    const params = createParams();

    renderHook(() => useKeyboardShortcuts(params));

    const event = new KeyboardEvent('keydown', {
      key: 'v',
      ctrlKey: true,
      bubbles: true,
    });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    textarea.dispatchEvent(event);

    expect(params.pasteNodes).not.toHaveBeenCalled();
    expect(preventDefaultSpy).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  it('undoes on Ctrl/Cmd+Z', () => {
    const params = createParams();

    renderHook(() => useKeyboardShortcuts(params));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }));

    expect(params.undo).toHaveBeenCalledTimes(1);
    expect(params.redo).not.toHaveBeenCalled();
  });

  it('redoes on Ctrl/Cmd+Shift+Z', () => {
    const params = createParams();

    renderHook(() => useKeyboardShortcuts(params));

    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      }),
    );

    expect(params.redo).toHaveBeenCalledTimes(1);
    expect(params.undo).not.toHaveBeenCalled();
  });

  it('redoes on Ctrl/Cmd+Y', () => {
    const params = createParams();

    renderHook(() => useKeyboardShortcuts(params));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, bubbles: true }));

    expect(params.redo).toHaveBeenCalledTimes(1);
  });
});

describe('useKeyboardShortcuts — listener lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers keydown listener exactly once, even across rerenders', () => {
    const params = createParams();
    const addSpy = vi.spyOn(window, 'addEventListener');

    const { rerender } = renderHook(() => useKeyboardShortcuts(params));

    rerender();
    rerender();
    rerender();

    const keydownCalls = addSpy.mock.calls.filter(([event]) => event === 'keydown');
    expect(keydownCalls).toHaveLength(1);

    addSpy.mockRestore();
  });

  it('uses the latest copyNodes callback after rerender', () => {
    const first = createParams();
    const second = createParams();
    (second.getNodes as ReturnType<typeof vi.fn>).mockReturnValue([makeSelectedNode()]);

    const { rerender } = renderHook(
      ({ params }: { params: IKeyboardParams }) => useKeyboardShortcuts(params),
      { initialProps: { params: first } },
    );

    rerender({ params: second });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true }));

    expect(second.copyNodes).toHaveBeenCalledTimes(1);
    expect(first.copyNodes).not.toHaveBeenCalled();
  });

  it('removes keydown listener on unmount', () => {
    const params = createParams();
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useKeyboardShortcuts(params));
    unmount();

    const keydownCalls = removeSpy.mock.calls.filter(([event]) => event === 'keydown');
    expect(keydownCalls).toHaveLength(1);

    removeSpy.mockRestore();
  });
});
