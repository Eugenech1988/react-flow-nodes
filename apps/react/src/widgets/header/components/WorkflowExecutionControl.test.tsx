import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowExecutionControl } from '@/widgets/header/components/WorkflowExecutionControl';

const mockStore = {
  executionStatus: 'idle',
  runWorkflow: vi.fn(),
  stopWorkflow: vi.fn(),
};

vi.mock('@/entities', () => ({
  useStore: (selector: (state: typeof mockStore) => unknown) => selector(mockStore),
}));

vi.mock('@pipeline/ui', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
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

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<ReactFlowProvider>{ui}</ReactFlowProvider>);
};

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

    const btn = screen.getByRole('button', { name: /stop/i });
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
