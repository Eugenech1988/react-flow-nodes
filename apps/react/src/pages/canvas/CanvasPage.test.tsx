import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CanvasPage } from './CanvasPage';

const {
  mockUsePipelines,
  mockUseUser,
  mockMutate,
  mockSetSearchParams,
  mockToastError,
  mockSearchParams,
} = vi.hoisted(() => ({
  mockUsePipelines: vi.fn(),
  mockUseUser: vi.fn(),
  mockMutate: vi.fn(),
  mockSetSearchParams: vi.fn(),
  mockToastError: vi.fn(),
  mockSearchParams: new URLSearchParams(),
}));

vi.mock('@/entities', () => ({ usePipelines: () => mockUsePipelines() }));
vi.mock('@/shared/hooks', () => ({ useUser: () => mockUseUser() }));
vi.mock('@/features/manage-pipelines', () => ({
  usePipelineHandler: () => ({
    setCurrentPipeline: { mutate: mockMutate, isPending: false },
  }),
}));
vi.mock('@/widgets/canvas', () => ({ Canvas: () => <div data-testid="canvas" /> }));
vi.mock('sonner', () => ({ toast: { error: mockToastError } }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams, mockSetSearchParams],
    Navigate: ({ to }: { to: string }) => <div data-testid={`navigate-${to}`} />,
  };
});

describe('CanvasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete('pipeline');
  });

  const renderPage = () => render(<MemoryRouter><CanvasPage /></MemoryRouter>);

  it('renders nothing while loading', () => {
    mockUsePipelines.mockReturnValue({ pipelines: [], isLoading: true });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });
    const { container } = renderPage();
    expect(container.firstChild).toBeNull();
  });

  it('navigates to pipelines if empty', () => {
    mockUsePipelines.mockReturnValue({ pipelines: [], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });
    renderPage();
    expect(screen.getByTestId('navigate-/pipelines')).toBeInTheDocument();
  });

  it('renders canvas if pipelines exist', () => {
    mockUsePipelines.mockReturnValue({ pipelines: [{ id: 'p1' }], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });
    renderPage();
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('handles shared pipeline success', async () => {
    mockSearchParams.set('pipeline', 'p1');
    mockUsePipelines.mockReturnValue({ pipelines: [{ id: 'p1' }], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });

    await act(async () => { renderPage(); });

    expect(mockMutate).toHaveBeenCalledWith({ id: 'p1' });
  });

  it('handles shared pipeline not found', async () => {
    mockSearchParams.set('pipeline', 'missing');
    mockUsePipelines.mockReturnValue({ pipelines: [], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });

    await act(async () => { renderPage(); });

    expect(mockToastError).toHaveBeenCalledWith('Pipeline not found or you do not have access to it.');
    expect(mockSetSearchParams).toHaveBeenCalledWith({}, { replace: true });
  });
});

describe('CanvasPage — extended coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.delete('pipeline');
  });

  const renderPage = () => render(<MemoryRouter><CanvasPage /></MemoryRouter>);

  it('clears URL when shared pipeline is already current', async () => {
    mockSearchParams.set('pipeline', 'p1');
    mockUsePipelines.mockReturnValue({ pipelines: [{ id: 'p1' }], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: 'p1' } });

    await act(async () => {
      renderPage();
    });

    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockSetSearchParams).toHaveBeenCalledWith({}, { replace: true });
  });

  it('does not process the same pipeline twice (processedRef guard)', async () => {
    mockSearchParams.set('pipeline', 'p1');
    mockUsePipelines.mockReturnValue({ pipelines: [{ id: 'p1' }], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });

    const { rerender } = render(
      <MemoryRouter>
        <CanvasPage />
      </MemoryRouter>,
    );

    await act(async () => {});
    const firstCallCount = mockMutate.mock.calls.length;

    rerender(
      <MemoryRouter>
        <CanvasPage />
      </MemoryRouter>,
    );
    await act(async () => {});

    expect(mockMutate.mock.calls.length).toBe(firstCallCount);
  });
});
