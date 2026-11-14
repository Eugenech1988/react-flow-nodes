import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTable, tableFeatures, flexRender } from '@tanstack/react-table';
import { buildJobColumns } from './columns';
import type { IJob } from './types';

vi.mock('../components/JobTableRowActions', () => ({
  JobTableRowActions: ({ onEdit }: { onEdit: (id: string) => void }) => (
    <button onClick={() => onEdit('edit-id')}>Actions</button>
  ),
}));

vi.mock('@/shared/ui', () => ({
  StatusBadge: ({ config }: { config: { label: string } }) => (
    <span data-testid="badge">{config.label}</span>
  ),
}));

const makeJob = (overrides: Partial<IJob> = {}): IJob => ({
  id: 'j1',
  slug: 'senior-dev',
  status: 'DRAFT',
  department: 'ENGINEERING',
  level: 'MID',
  type: 'FULL_TIME',
  location: 'Remote',
  icon: null,
  publishedAt: null,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  translations: [
    {
      id: 't1',
      jobId: 'j1',
      locale: 'en',
      title: 'Senior Dev',
      description: 'Desc',
      responsibilities: [],
      requirements: [],
      metaTitle: null,
      metaDescription: null,
    },
  ],
  ...overrides,
});

const renderAllCells = (job: IJob) => {
  const { result } = renderHook(() =>
    useTable({
      data: [job],
      columns: buildJobColumns(vi.fn()),
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

describe('admin-jobs columns', () => {
  it('buildJobColumns returns 6 columns', () => {
    expect(buildJobColumns(vi.fn())).toHaveLength(6);
  });

  it('slug cell', () => {
    renderAllCells(makeJob({ slug: 'test-slug' }));
    expect(screen.getByText('test-slug')).toBeInTheDocument();
  });

  it('title cell renders EN title', () => {
    renderAllCells(makeJob());
    expect(screen.getByText('Senior Dev')).toBeInTheDocument();
  });

  it('title cell shows Missing EN badge', () => {
    renderAllCells(makeJob({ translations: [] }));
    expect(screen.getByText('Missing EN')).toBeInTheDocument();
  });

  it('department cell', () => {
    renderAllCells(makeJob({ department: 'DESIGN' }));
    expect(screen.getByText('DESIGN')).toBeInTheDocument();
  });

  it('locales cell', () => {
    renderAllCells(makeJob());
    expect(screen.getByText('en')).toBeInTheDocument();
  });

  it('locales cell shows dash for no translations', () => {
    renderAllCells(makeJob({ translations: [] }));
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('status cell renders badge', () => {
    renderAllCells(makeJob({ status: 'PUBLISHED' }));
    expect(screen.getByTestId('badge')).toHaveTextContent('Published');
  });

  it('actions cell', () => {
    renderAllCells(makeJob());
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
