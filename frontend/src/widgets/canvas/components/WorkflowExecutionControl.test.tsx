import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowExecutionControl } from './WorkflowExecutionControl';

const mockStore = {
  executionStatus: 'idle',
  runWorkflow: vi.fn(),
  stopWorkflow: vi.fn(),
};

vi.mock('@/entities', () => ({
  useStore: (selector: (state: typeof mockStore) => unknown) => selector(mockStore),
}));

vi.mock('@/shared/ui', () => ({
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

  it('renders "Run" button when status is idle', () => {
    renderWithProvider(<WorkflowExecutionControl />);
    const btn = screen.getByRole('button', { name: /run/i });
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

  it('renders "Success" state correctly', () => {
    mockStore.executionStatus = 'success';
    renderWithProvider(<WorkflowExecutionControl />);
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });

  it('renders "Failed" state correctly', () => {
    mockStore.executionStatus = 'failed';
    renderWithProvider(<WorkflowExecutionControl />);
    expect(screen.getByText(/failed/i)).toBeInTheDocument();
  });
});