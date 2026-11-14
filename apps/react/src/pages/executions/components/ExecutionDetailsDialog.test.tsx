import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExecutionDetailsDialog } from './ExecutionDetailsDialog';
import type { IExecutionItem } from '../model';
import type { TExecutionLog } from '@/entities';

vi.mock('@pipeline/ui', () => ({
  Dialog: ({ children, open }: unknown) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/shared/ui', () => ({
  DialogHeader: ({ title, onClose }: unknown) => (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  ),
  DialogBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ onCancel }: unknown) => <button onClick={onCancel}>Footer Close</button>,
}));

vi.mock('@/shared/lib', () => ({
  formatTimestamp: (ts: string | number) => `[${ts}]`,
}));

const makeExecution = (logs?: unknown): IExecutionItem => ({
  id: 'e1',
  pipelineName: 'P1',
  pipelineId: 'p1',
  status: 'success',
  duration: '00:01.00',
  triggeredBy: 'MANUAL',
  nodesExecuted: 3,
  startedAt: '2024-01-01',
  finishedAt: '2024-01-01',
  logs: logs ?? [],
});

describe('ExecutionDetailsDialog', () => {
  it('renders nothing when execution null', () => {
    const { container } = render(<ExecutionDetailsDialog execution={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders execution details', () => {
    render(<ExecutionDetailsDialog execution={makeExecution()} onClose={vi.fn()} />);
    expect(screen.getByText('Execution Details')).toBeInTheDocument();
    expect(screen.getByText('e1')).toBeInTheDocument();
    expect(screen.getByText('P1')).toBeInTheDocument();
    expect(screen.getByText('MANUAL')).toBeInTheDocument();
  });

  it('renders empty logs message', () => {
    render(<ExecutionDetailsDialog execution={makeExecution([])} onClose={vi.fn()} />);
    expect(screen.getByText('No logs recorded for this execution.')).toBeInTheDocument();
  });

  it('sorts logs by order', () => {
    const logs: Record<string, TExecutionLog> = {
      a: { id: 'a', type: 'info', message: 'third', timestamp: 100, order: 2 },
      b: { id: 'b', type: 'info', message: 'first', timestamp: 200, order: 0 },
      c: { id: 'c', type: 'info', message: 'second', timestamp: 50, order: 1 },
    };
    render(
      <ExecutionDetailsDialog execution={makeExecution(logs)} onClose={vi.fn()} />
    );

    const messages = screen.getAllByText(/first|second|third/);
    expect(messages.map((m) => m.textContent)).toEqual(['first', 'second', 'third']);
  });

  it('sorts by timestamp when order missing', () => {
    const logs: TExecutionLog[] = [
      { id: 'a', type: 'info', message: 'late', timestamp: 300 },
      { id: 'b', type: 'info', message: 'early', timestamp: 100 },
    ];
    render(
      <ExecutionDetailsDialog execution={makeExecution(logs)} onClose={vi.fn()} />
    );

    const messages = screen.getAllByText(/late|early/);
    expect(messages.map((m) => m.textContent)).toEqual(['early', 'late']);
  });

  it('handles unknown log type as info', () => {
    const logs = [{ id: 'a', type: 'unknown', message: 'test', timestamp: 100 }] as unknown as never;
    render(
      <ExecutionDetailsDialog execution={makeExecution(logs)} onClose={vi.fn()} />
    );
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
