import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTable, tableFeatures, flexRender } from '@tanstack/react-table';
import { buildColumns } from './columns';
import type { IExecutionItem } from './types';

vi.mock('@/shared/ui', () => ({
  StatusBadge: ({ config }: { config: { label: string } }) => (
    <span data-testid="badge">{config.label}</span>
  ),
}));

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    Clock: () => <span data-testid="clock-icon" />,
    PlayCircle: () => <span data-testid="play-icon" />,
  };
});

const makeExec = (overrides: Partial<IExecutionItem> = {}): IExecutionItem => ({
  id: 'e1',
  pipelineName: 'P1',
  pipelineId: 'p1',
  status: 'success',
  duration: '00:01.00',
  triggeredBy: 'MANUAL',
  nodesExecuted: 5,
  startedAt: '2024-01-01',
  finishedAt: '2024-01-02',
  logs: [],
  ...overrides,
});

const renderAllCells = (exec: IExecutionItem) => {
  const { result } = renderHook(() =>
    useTable({
      data: [exec],
      columns: buildColumns(),
      features: tableFeatures({}),
    }),
  );

  const cells = result.current.getRowModel().rows[0].getAllCells();

  return render(
    <div>
      {cells.map((c) => (
        <div key={c.id} data-testid={`cell-${c.column.id}`}>
          {flexRender(c.column.columnDef.cell, c.getContext())}
        </div>
      ))}
    </div>,
  );
};

describe('executions columns', () => {
  it('buildColumns returns 8 columns', () => {
    expect(buildColumns()).toHaveLength(8);
  });

  it('id cell renders id with title', () => {
    renderAllCells(makeExec({ id: 'very-long-exec-id' }));
    expect(screen.getByTitle('very-long-exec-id')).toBeInTheDocument();
  });

  it('pipelineName cell', () => {
    renderAllCells(makeExec({ pipelineName: 'My Pipeline' }));
    expect(screen.getByText('My Pipeline')).toBeInTheDocument();
  });

  it('status cell renders badge', () => {
    renderAllCells(makeExec({ status: 'failed' }));
    expect(screen.getByTestId('badge')).toHaveTextContent('Failed');
  });

  it('triggeredBy cell', () => {
    renderAllCells(makeExec({ triggeredBy: 'WEBHOOK' }));
    expect(screen.getByText('WEBHOOK')).toBeInTheDocument();
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
  });

  it('nodesExecuted cell', () => {
    renderAllCells(makeExec({ nodesExecuted: 42 }));
    expect(screen.getByText('42 nodes')).toBeInTheDocument();
  });

  it('duration cell', () => {
    renderAllCells(makeExec({ duration: '00:05.00' }));
    expect(screen.getByText('00:05.00')).toBeInTheDocument();
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('startedAt cell', () => {
    renderAllCells(makeExec({ startedAt: '2024-01-01' }));
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('finishedAt cell', () => {
    renderAllCells(makeExec({ finishedAt: '2024-01-02' }));
    expect(screen.getByText('2024-01-02')).toBeInTheDocument();
  });
});
