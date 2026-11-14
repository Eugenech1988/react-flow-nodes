import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowExecutionControl } from '@/widgets/header/components/WorkflowExecutionControl';

const mockStore = vi.hoisted(() => ({
  executionStatus: 'idle' as string,
  runWorkflow: vi.fn<() => void>(),
  stopWorkflow: vi.fn<() => void>(),
  setLastRunInfo: vi.fn<() => void>(),
}));

type TStoreMock = typeof mockStore;

vi.mock('@/entities', () => ({
  useStore: (selector: (state: TStoreMock) => unknown) => selector(mockStore),
}));

const mockNavigate = vi.fn<() => void>();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
}));

vi.mock('@pipeline/ui', () => ({
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@xyflow/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@xyflow/react')>();
  return {
    ...actual,
    useReactFlow: () => ({
      unselectNodesAndEdges: vi.fn(),
      setNodes: vi.fn(),
      setEdges: vi.fn(),
    }),
  };
});

const renderWithProvider = (ui: ReactElement) =>
  render(<ReactFlowProvider>{ui}</ReactFlowProvider>);

describe('WorkflowExecutionControl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.executionStatus = 'idle';
  });

  it('renders "Start" button when status is idle', () => {
    renderWithProvider(<WorkflowExecutionControl />);
    const btn = screen.getByRole('button', { name: /start workflow/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(mockStore.runWorkflow).toHaveBeenCalledTimes(1);
  });

  it('renders "Stop" button when status is running', () => {
    mockStore.executionStatus = 'running';
    renderWithProvider(<WorkflowExecutionControl />);

    const btn = screen.getByRole('button', { name: /stop workflow/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(mockStore.stopWorkflow).toHaveBeenCalledTimes(1);
  });

  it('allows restarting after success', () => {
    mockStore.executionStatus = 'success';
    renderWithProvider(<WorkflowExecutionControl />);
    const btn = screen.getByRole('button', { name: /restart workflow/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockStore.runWorkflow).toHaveBeenCalledTimes(1);
  });

  it('allows retrying after failure', () => {
    mockStore.executionStatus = 'failed';
    renderWithProvider(<WorkflowExecutionControl />);
    const btn = screen.getByRole('button', { name: /retry workflow/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockStore.runWorkflow).toHaveBeenCalledTimes(1);
  });
});
