import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutionsPage } from './ExecutionsPage';

const {
  mockSetPage,
  mockSetLimit,
  mockSetSelectedExec,
  mockHandleRefresh,
  mockHandleSearchChange,
  mockHandleTabChange,
  mockUseExecutionsTable,
} = vi.hoisted(() => ({
  mockSetPage: vi.fn(),
  mockSetLimit: vi.fn(),
  mockSetSelectedExec: vi.fn(),
  mockHandleRefresh: vi.fn(),
  mockHandleSearchChange: vi.fn(),
  mockHandleTabChange: vi.fn(),
  mockUseExecutionsTable: vi.fn(),
}));

vi.mock('./hooks', () => ({
  useExecutionsTable: () => mockUseExecutionsTable(),
}));

vi.mock('./components', () => ({
  PageHeader: ({ handleRefresh }: unknown) => (
    <button data-testid="page-header-refresh" onClick={handleRefresh}>
      Refresh
    </button>
  ),
  ExecutionDetailsDialog: ({ onClose }: unknown) => (
    <button data-testid="dialog-close" onClick={onClose}>
      Close
    </button>
  ),
}));

vi.mock('@/shared/ui', () => ({
  FloatingInput: ({ onChange }: unknown) => (
    <input data-testid="search" onChange={onChange} />
  ),
  Tabs: ({ onTabChange }: unknown) => (
    <button data-testid="tab" onClick={() => onTabChange('failed')}>
      Tab
    </button>
  ),
  TableSkeleton: () => <div data-testid="skeleton" />,
  UniversalTable: ({
    onSort,
    onSelect,
    onPageChange,
    onLimitChange,
  }: unknown) => (
    <div data-testid="table">
      <button data-testid="sort" onClick={() => onSort('slug')}>
        Sort
      </button>
      <button data-testid="select" onClick={() => onSelect({ id: 'x' })}>
        Select
      </button>
      <button data-testid="page" onClick={() => onPageChange(2)}>
        Page
      </button>
      <button data-testid="limit" onClick={() => onLimitChange(20)}>
        Limit
      </button>
    </div>
  ),
}));

vi.mock('@/shared/lib', () => ({
  PAGE_VARIANTS: {},
}));

const defaultHook = {
  searchQuery: '',
  statusFilter: 'all',
  selectedExec: null,
  isLoading: false,
  isFetching: false,
  processedExecutions: [],
  page: 1,
  totalPages: 1,
  limit: 10,
  totalRuns: 0,
  setPage: mockSetPage,
  setLimit: mockSetLimit,
  setSelectedExec: mockSetSelectedExec,
  handleSearchChange: mockHandleSearchChange,
  handleTabChange: mockHandleTabChange,
  handleRefresh: mockHandleRefresh,
};

describe('ExecutionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseExecutionsTable.mockReturnValue(defaultHook);
  });

  it('renders header, search, tabs and table', () => {
    render(<ExecutionsPage />);
    expect(screen.getByTestId('page-header-refresh')).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeInTheDocument();
    expect(screen.getByTestId('tab')).toBeInTheDocument();
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('renders skeleton when loading', () => {
    mockUseExecutionsTable.mockReturnValue({ ...defaultHook, isLoading: true });
    render(<ExecutionsPage />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('table')).not.toBeInTheDocument();
  });

  it('invokes handleRefresh', () => {
    render(<ExecutionsPage />);
    fireEvent.click(screen.getByTestId('page-header-refresh'));
    expect(mockHandleRefresh).toHaveBeenCalled();
  });

  it('invokes handleSearchChange', () => {
    render(<ExecutionsPage />);
    fireEvent.change(screen.getByTestId('search'), { target: { value: 'abc' } });
    expect(mockHandleSearchChange).toHaveBeenCalled();
  });

  it('invokes handleTabChange', () => {
    render(<ExecutionsPage />);
    fireEvent.click(screen.getByTestId('tab'));
    expect(mockHandleTabChange).toHaveBeenCalledWith('failed');
  });

  it('invokes onSort from table', () => {
    render(<ExecutionsPage />);
    fireEvent.click(screen.getByTestId('sort'));
    expect(mockSetSelectedExec).not.toHaveBeenCalled();
  });

  it('invokes onSelect from table', () => {
    render(<ExecutionsPage />);
    fireEvent.click(screen.getByTestId('select'));
    expect(mockSetSelectedExec).toHaveBeenCalledWith({ id: 'x' });
  });

  it('invokes onPageChange from table', () => {
    render(<ExecutionsPage />);
    fireEvent.click(screen.getByTestId('page'));
    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it('invokes onLimitChange from table', () => {
    render(<ExecutionsPage />);
    fireEvent.click(screen.getByTestId('limit'));
    expect(mockSetLimit).toHaveBeenCalledWith(20);
  });

  it('invokes onClose from details dialog', () => {
    render(<ExecutionsPage />);
    fireEvent.click(screen.getByTestId('dialog-close'));
    expect(mockSetSelectedExec).toHaveBeenCalledWith(null);
  });
});
