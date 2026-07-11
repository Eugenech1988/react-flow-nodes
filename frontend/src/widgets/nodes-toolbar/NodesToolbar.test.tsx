import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NodesToolbar } from '@/widgets';

interface DraggableNodeProps {
  type: string;
  label: string;
  icon: string;
}

const { draggableNodeMock } = vi.hoisted(() => ({
  draggableNodeMock: vi.fn((props: DraggableNodeProps) => (
    <div data-testid="draggable-node">{props.label}</div>
  )),
}));

vi.mock('@/features/manage-nodes', () => ({
  DraggableNode: draggableNodeMock,
}));

describe('Toolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all toolbar groups', () => {
    render(<NodesToolbar />);

    expect(screen.getByText('I/O')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Logic')).toBeInTheDocument();
    expect(screen.getByText('Integrations')).toBeInTheDocument();
  });

  it('renders all draggable nodes', () => {
    render(<NodesToolbar />);

    expect(screen.getAllByTestId('draggable-node')).toHaveLength(9);

    const expectedLabels = [
      'Input', 'Output', 'Text', 'Image', 'LLM',
      'Math', 'Condition', 'API', 'Database'
    ];

    expectedLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('passes correct props to DraggableNode', () => {
    render(<NodesToolbar />);

    // Используем типизированный массив вызовов
    const propsList = draggableNodeMock.mock.calls.map(([props]) => props);

    expect(propsList).toEqual(
      expect.arrayContaining([
        { type: 'customInput', label: 'Input', icon: '→' },
        { type: 'customOutput', label: 'Output', icon: '⇥' },
        { type: 'text', label: 'Text', icon: '✎' },
        { type: 'image', label: 'Image', icon: '▧' },
        { type: 'llm', label: 'LLM', icon: '✨' },
        { type: 'math', label: 'Math', icon: '∑' },
        { type: 'conditional', label: 'Condition', icon: '⑂' },
        { type: 'api', label: 'API', icon: '⇄' },
        { type: 'database', label: 'Database', icon: '⛁' },
      ])
    );
  });
});