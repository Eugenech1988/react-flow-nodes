import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobTableRowActions } from './JobTableRowActions';
import type { IJob } from '../model/types';

const { mockPublish, mockArchive, mockRemove } = vi.hoisted(() => ({
  mockPublish: { mutate: vi.fn(), isPending: false, variables: null as unknown as never },
  mockArchive: { mutate: vi.fn(), isPending: false, variables: null as unknown as never },
  mockRemove: { mutate: vi.fn(), isPending: false, variables: null as unknown as never },
}));

vi.mock('../hooks/', () => ({
  useJobMutations: () => ({
    publish: mockPublish,
    archive: mockArchive,
    remove: mockRemove,
  }),
}));

vi.mock('@pipeline/ui', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, onClick, disabled }: unknown) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, disabled }: unknown) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />,
}));

vi.mock('./JobDeleteModal', () => ({
  JobDeleteModal: ({ isOpen, onConfirm }: unknown) =>
    isOpen ? <button onClick={onConfirm}>ConfirmDelete</button> : null,
}));

const makeJob = (overrides: Partial<IJob> = {}): IJob => ({
  id: 'j1',
  slug: 'senior',
  status: 'DRAFT',
  department: 'ENGINEERING',
  level: 'MID',
  type: 'FULL_TIME',
  location: 'Remote',
  icon: null,
  publishedAt: null,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  translations: [],
  ...overrides,
});

describe('JobTableRowActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPublish.isPending = false;
    mockPublish.variables = null;
    mockArchive.isPending = false;
    mockArchive.variables = null;
    mockRemove.isPending = false;
    mockRemove.variables = null;
  });

  it('triggers onEdit on Edit', () => {
    const onEdit = vi.fn();
    render(<JobTableRowActions job={makeJob()} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith('j1');
  });

  it('shows Publish for non-published', () => {
    render(<JobTableRowActions job={makeJob({ status: 'DRAFT' })} onEdit={vi.fn()} />);
    fireEvent.click(screen.getByText('Publish'));
    expect(mockPublish.mutate).toHaveBeenCalledWith({ id: 'j1' });
  });

  it('hides Publish for published', () => {
    render(<JobTableRowActions job={makeJob({ status: 'PUBLISHED' })} onEdit={vi.fn()} />);
    expect(screen.queryByText('Publish')).not.toBeInTheDocument();
  });

  it('shows Archive for non-archived', () => {
    render(<JobTableRowActions job={makeJob({ status: 'DRAFT' })} onEdit={vi.fn()} />);
    fireEvent.click(screen.getByText('Archive'));
    expect(mockArchive.mutate).toHaveBeenCalledWith({ id: 'j1' });
  });

  it('hides Archive for archived', () => {
    render(<JobTableRowActions job={makeJob({ status: 'ARCHIVED' })} onEdit={vi.fn()} />);
    expect(screen.queryByText('Archive')).not.toBeInTheDocument();
  });

  it('opens delete modal', () => {
    render(<JobTableRowActions job={makeJob()} onEdit={vi.fn()} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('ConfirmDelete')).toBeInTheDocument();
  });

  it('confirms delete via modal', () => {
    mockRemove.mutate.mockImplementation((_, opts) => opts?.onSuccess?.());
    render(<JobTableRowActions job={makeJob()} onEdit={vi.fn()} />);
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('ConfirmDelete'));
    expect(mockRemove.mutate).toHaveBeenCalledWith(
      { id: 'j1' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
  });

  it('disables trigger during pending', () => {
    mockPublish.isPending = true;
    mockPublish.variables = { id: 'j1' };
    const { container } = render(
      <JobTableRowActions job={makeJob()} onEdit={vi.fn()} />
    );
    const trigger = container.querySelector('button');
    expect(trigger).toBeDisabled();
  });
});
