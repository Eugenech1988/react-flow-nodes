import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CanvasPage } from './CanvasPage';

interface IPipelineHandlerOptions {
  onSetCurrentSuccess?: () => void;
  onSetCurrentError?: (error: Error) => void;
}

interface ISetCurrentPipeline {
  mutate: Mock<(pipeline: { id: string }) => void>;
  isPending: boolean;
  isError: boolean;
}

const mockOptions = vi.hoisted(() => ({ current: null as IPipelineHandlerOptions | null }));
const mockSetCurrentPipeline = vi.hoisted<ISetCurrentPipeline>(() => ({
  mutate: vi.fn<(pipeline: { id: string }) => void>(),
  isPending: false,
  isError: false,
}));
const mockUsePipelines = vi.hoisted(() => vi.fn());
const mockUseUser = vi.hoisted(() => vi.fn());
const mockSetSearchParams = vi.hoisted(() => vi.fn());
const mockToastError = vi.hoisted(() => vi.fn<(message: string) => void>());
const mockSearchParams = vi.hoisted(() => ({ current: new URLSearchParams() }));

vi.mock('@/entities', () => ({
  usePipelines: () => mockUsePipelines(),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

vi.mock('@/features/manage-pipelines', () => ({
  usePipelineHandler: (options?: IPipelineHandlerOptions) => {
    mockOptions.current = options ?? null;
    return { setCurrentPipeline: mockSetCurrentPipeline };
  },
}));

vi.mock('@/widgets/canvas', () => ({
  Canvas: () => <div data-testid="canvas" />,
}));

vi.mock('@/shared/ui', () => ({
  GlobalLoader: () => <div data-testid="global-loader" />,
}));

vi.mock('sonner', () => ({
  toast: { error: mockToastError },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams.current, mockSetSearchParams],
    Navigate: ({ to }: { to: string }) => <div data-testid={`navigate-${to}`} />,
  };
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <CanvasPage />
    </MemoryRouter>,
  );

describe('CanvasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.current = new URLSearchParams();
    mockSetCurrentPipeline.isPending = false;
    mockSetCurrentPipeline.isError = false;
    mockOptions.current = null;
  });

  it('renders loader while pipelines are loading', () => {
    mockUsePipelines.mockReturnValue({ pipelines: [], isLoading: true });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });
    renderPage();
    expect(screen.getByTestId('global-loader')).toBeInTheDocument();
  });

  it('renders loader while mutation is pending', () => {
    mockSetCurrentPipeline.isPending = true;
    mockUsePipelines.mockReturnValue({ pipelines: [{ id: 'p1' }], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });
    renderPage();
    expect(screen.getByTestId('global-loader')).toBeInTheDocument();
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
    mockSearchParams.current.set('pipeline', 'p1');
    mockUsePipelines.mockReturnValue({ pipelines: [{ id: 'p1' }], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });

    await act(async () => { renderPage(); });

    expect(mockSetCurrentPipeline.mutate).toHaveBeenCalledWith({ id: 'p1' });
  });

  it('handles shared pipeline not found', async () => {
    mockSearchParams.current.set('pipeline', 'missing');
    mockUsePipelines.mockReturnValue({ pipelines: [], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });

    await act(async () => { renderPage(); });

    expect(mockToastError).toHaveBeenCalledWith(
      'Pipeline not found or you do not have access to it.',
    );
    expect(mockSetSearchParams).toHaveBeenCalledWith({}, { replace: true });
  });

  it('clears URL when shared pipeline is already current', async () => {
    mockSearchParams.current.set('pipeline', 'p1');
    mockUsePipelines.mockReturnValue({ pipelines: [{ id: 'p1' }], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: 'p1' } });

    await act(async () => { renderPage(); });

    expect(mockSetCurrentPipeline.mutate).not.toHaveBeenCalled();
    expect(mockSetSearchParams).toHaveBeenCalledWith({}, { replace: true });
  });

  it('handles shared pipeline error: toast + clears URL + resets processedRef', async () => {
    mockSearchParams.current.set('pipeline', 'p1');
    mockUsePipelines.mockReturnValue({ pipelines: [{ id: 'p1' }], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });

    await act(async () => { renderPage(); });

    expect(mockOptions.current?.onSetCurrentError).toBeDefined();

    const error = new Error('network failure');
    await act(async () => {
      mockOptions.current?.onSetCurrentError?.(error);
    });

    expect(mockToastError).toHaveBeenCalledWith('network failure');
    expect(mockSetSearchParams).toHaveBeenCalledWith({}, { replace: true });
  });

  it('does not process the same pipeline twice (processedRef guard)', async () => {
    mockSearchParams.current.set('pipeline', 'p1');
    mockUsePipelines.mockReturnValue({ pipelines: [{ id: 'p1' }], isLoading: false });
    mockUseUser.mockReturnValue({ user: { currentPipelineId: null } });

    const { rerender } = renderPage();
    await act(async () => {});

    const firstCallCount = mockSetCurrentPipeline.mutate.mock.calls.length;

    rerender(
      <MemoryRouter>
        <CanvasPage />
      </MemoryRouter>,
    );
    await act(async () => {});

    expect(mockSetCurrentPipeline.mutate.mock.calls.length).toBe(firstCallCount);
  });
});
