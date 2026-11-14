import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { TPipeline } from '@/entities';
import { PipelineCard } from './PipelineCard';

interface IMutationMock {
  mutate: ReturnType<typeof vi.fn>;
  isPending: boolean;
}

const mocks = vi.hoisted(() => ({
  navigate: vi.fn<(path: string) => void>(),
  openUpdateModal: vi.fn<(pipeline: TPipeline) => void>(),
  deletePipeline: { mutate: vi.fn(), isPending: false } as IMutationMock,
  setCurrentPipeline: { mutate: vi.fn(), isPending: false } as IMutationMock,
}));

vi.mock('@/features/manage-pipelines', () => ({
  usePipelineHandler: () => ({
    deletePipeline: mocks.deletePipeline,
    setCurrentPipeline: mocks.setCurrentPipeline,
  }),
}));

vi.mock('@/features/manage-pipelines/ui/PipelineDeleteModal', () => ({
  PipelineDeleteModal: ({
    isOpen,
    onConfirm,
    onClose,
    pipelineName,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
    pipelineName: string;
  }) =>
    isOpen ? (
      <div data-testid="pipeline-delete-modal">
        <span>{pipelineName}</span>
        <button onClick={onConfirm}>confirm-delete</button>
        <button onClick={onClose}>cancel-delete</button>
      </div>
    ) : null,
}));

vi.mock('../model', () => ({
  usePipelineDialogStore: (
    selector: (state: { openUpdateModal: typeof mocks.openUpdateModal }) => unknown,
  ) => selector({ openUpdateModal: mocks.openUpdateModal }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock('@pipeline/ui', () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({
    children,
    disabled,
  }: {
    children: ReactNode;
    disabled?: boolean;
  }) => <button disabled={disabled}>{children}</button>,
  DropdownMenuItem: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

const makePipeline = (overrides: Partial<TPipeline> = {}): TPipeline => ({
  id: 'p1',
  name: 'My Pipeline',
  description: 'desc',
  screenshotUrl: null,
  status: 'DRAFT',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  graphData: null,
  userId: 'u1',
  lastRunAt: null,
  lastRunStatus: null,
  ...overrides,
});

const renderCard = (pipeline: TPipeline) =>
  render(
    <MemoryRouter>
      <PipelineCard pipeline={pipeline} />
    </MemoryRouter>,
  );

describe('PipelineCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.deletePipeline.isPending = false;
    mocks.setCurrentPipeline.isPending = false;
  });

  it('renders name and description', () => {
    renderCard(makePipeline());
    expect(screen.getByText('My Pipeline')).toBeInTheDocument();
    expect(screen.getByText('desc')).toBeInTheDocument();
  });

  it('opens delete modal on Delete click (does not mutate immediately)', () => {
    renderCard(makePipeline());
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByTestId('pipeline-delete-modal')).toBeInTheDocument();
    expect(mocks.deletePipeline.mutate).not.toHaveBeenCalled();
  });

  it('calls deletePipeline.mutate on confirm', () => {
    renderCard(makePipeline());
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('confirm-delete'));
    expect(mocks.deletePipeline.mutate).toHaveBeenCalledWith(
      'p1',
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it('does not mutate on cancel', () => {
    renderCard(makePipeline());
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('cancel-delete'));
    expect(mocks.deletePipeline.mutate).not.toHaveBeenCalled();
  });

  it('opens edit modal on Edit Workflow click', () => {
    renderCard(makePipeline());
    fireEvent.click(screen.getByText('Edit Workflow'));
    expect(mocks.openUpdateModal).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1' }));
  });

  it('calls setCurrentPipeline on card click', () => {
    renderCard(makePipeline());
    fireEvent.click(screen.getByText('desc'));
    expect(mocks.setCurrentPipeline.mutate).toHaveBeenCalled();
  });

  it('disables delete when busy', () => {
    mocks.setCurrentPipeline.isPending = true;
    renderCard(makePipeline());
    expect(screen.getByText('Delete').closest('button')).toBeDisabled();
  });
});

describe('PipelineCard — nested click behaviors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.deletePipeline.isPending = false;
    mocks.setCurrentPipeline.isPending = false;
  });

  it('click on name opens edit modal, not select', () => {
    renderCard(makePipeline());
    fireEvent.click(screen.getByText('My Pipeline'));
    expect(mocks.openUpdateModal).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1' }));
    expect(mocks.setCurrentPipeline.mutate).not.toHaveBeenCalled();
  });
});
