import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DraggableNode } from './DraggableNode';

describe('DraggableNode', () => {
  it('renders label and icon', () => {
    render(
      <DraggableNode
        type="text"
        label="Text"
        icon="📝"
      />
    );

    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('📝')).toBeInTheDocument();
  });

  it('renders without icon', () => {
    render(<DraggableNode type="text" label="Text" />);

    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('applies accent color style', () => {
    render(<DraggableNode type="text" label="Text" />);

    const node = screen.getByText('Text').parentElement!;

    expect(node.style.borderColor).toBe('var(--node-text)');
    expect(node.style.color).toBe('var(--node-text)');
  });

  it('uses default accent color for unknown type', () => {
    render(<DraggableNode type="unknown" label="Unknown" />);

    const node = screen.getByText('Unknown').parentElement!;

    expect(node.style.borderColor).toBe('var(--node-default)');
    expect(node.style.color).toBe('var(--node-default)');
  });

  it('sets dataTransfer payload on drag start', () => {
    render(<DraggableNode type="llm" label="LLM" />);

    const node = screen.getByText('LLM').parentElement!;

    const setData = vi.fn();

    fireEvent.dragStart(node, {
      dataTransfer: {
        setData,
        effectAllowed: '',
      },
    });

    expect(setData).toHaveBeenCalledWith(
      'application/reactflow',
      JSON.stringify({ nodeType: 'llm' })
    );

    expect(node.style.cursor).toBe('grabbing');
  });

  it('restores cursor on drag end', () => {
    render(<DraggableNode type="llm" label="LLM" />);

    const node = screen.getByText('LLM').parentElement!;

    fireEvent.dragEnd(node);

    expect(node.style.cursor).toBe('grab');
  });

  it('is draggable', () => {
    render(<DraggableNode type="text" label="Text" />);

    const node = screen.getByText('Text').parentElement!;

    expect(node).toHaveAttribute('draggable', 'true');
  });
});