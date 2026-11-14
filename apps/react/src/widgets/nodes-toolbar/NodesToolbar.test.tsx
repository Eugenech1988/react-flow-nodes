import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NodesToolbar } from '@/widgets';

const draggableNodeMock = vi.fn();

vi.mock('@/features/manage-nodes', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/manage-nodes')>();
  return {
    ...actual,
    DraggableNode: (props: { type: string; label: string; icon: string }) => {
      draggableNodeMock(props);
      return <div data-testid="draggable-node">{props.label}</div>;
    },
  };
});

describe('NodesToolbar', () => {
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
      'Input',
      'Output',
      'Text',
      'Image',
      'LLM',
      'Math',
      'Condition',
      'API',
      'Database',
    ];

    expectedLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('passes correct props to DraggableNode', () => {
    render(<NodesToolbar />);
    const propsList = draggableNodeMock.mock.calls.map(
      (call) => call[0] as { type: string; label: string; icon: string },
    );

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
      ]),
    );
  });

  it('hides node library and shows open button when closed', async () => {
    render(<NodesToolbar />);
    fireEvent.click(screen.getByRole('button', { name: /close node library/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /close node library/i }),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /open node library/i })).toBeInTheDocument();
  });

  it('reopens node library when open button clicked', async () => {
    render(<NodesToolbar />);
    fireEvent.click(screen.getByRole('button', { name: /close node library/i }));

    const openBtn = await screen.findByRole('button', { name: /open node library/i });
    fireEvent.click(openBtn);

    expect(
      await screen.findByRole('button', { name: /close node library/i }),
    ).toBeInTheDocument();
  });
});
