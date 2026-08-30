import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useKeyboardShortcuts, isInputElement } from './useKeyboardShortcuts';
import type { TPipelineNode, TPipelineEdge } from '@/entities';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
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
  const copyNodes = vi.fn();
  const pasteNodes = vi.fn();
  const getNodes = vi.fn<() => TPipelineNode[]>(() => []);
  const getEdges = vi.fn<() => TPipelineEdge[]>(() => []);
  const undo = vi.fn();
  const redo = vi.fn();

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
});
