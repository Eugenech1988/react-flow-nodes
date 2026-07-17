import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutionLogConsole } from './ExecutionLogConsole';

const mockStore = {
  logs: [],
  executionStatus: 'idle',
  clearLogs: vi.fn(),
  stopWorkflow: vi.fn(),
};

vi.mock('@/entities', () => ({
  useStore: (selector: (state: typeof mockStore) => unknown) => selector(mockStore),
}));

describe('ExecutionLogConsole', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.logs = [];
    mockStore.executionStatus = 'idle';
  });

  it('does not render when idle and logs are empty', () => {
    render(<ExecutionLogConsole />);
    expect(screen.queryByText(/execution logs/i)).not.toBeInTheDocument();
  });

  it('renders when there are logs', () => {
    mockStore.logs = [{ id: '1', timestamp: '12:00', message: 'Test log', type: 'info' }];
    render(<ExecutionLogConsole />);
    expect(screen.getByText(/execution logs/i)).toBeInTheDocument();
    expect(screen.getByText('Test log')).toBeInTheDocument();
  });

  it('renders correctly when status is running', () => {
    mockStore.executionStatus = 'running';
    render(<ExecutionLogConsole />);
    expect(screen.getByText(/running/i)).toBeInTheDocument();
    expect(screen.getByTitle('Stop')).toBeInTheDocument();
  });

  it('renders correctly when status is failed', () => {
    mockStore.executionStatus = 'failed';
    mockStore.logs = [{ id: '1', timestamp: '12:00', message: 'Error!', type: 'error' }];
    render(<ExecutionLogConsole />);
    expect(screen.getByText(/failed/i)).toBeInTheDocument();
  });

  it('calls clearLogs when clear button is clicked', () => {
    mockStore.logs = [{ id: '1', timestamp: '12:00', message: 'Test', type: 'info' }];
    render(<ExecutionLogConsole />);

    const clearBtn = screen.getByTitle(/clear/i);
    fireEvent.click(clearBtn);

    expect(mockStore.clearLogs).toHaveBeenCalledTimes(1);
  });

  it('minimizes and expands correctly', () => {
    mockStore.logs = [{ id: '1', timestamp: '12:00', message: 'Test', type: 'info' }];
    render(<ExecutionLogConsole />);

    const minimizeBtn = screen.getByTitle(/minimize/i);
    fireEvent.click(minimizeBtn);

    expect(screen.queryByText(/execution logs/i)).not.toBeInTheDocument();

    const expandBtn = screen.getByTitle(/expand logs/i);
    fireEvent.click(expandBtn);

    expect(screen.getByText(/execution logs/i)).toBeInTheDocument();
  });
});