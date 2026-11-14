import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvoiceHistory } from './InvoiceHistory';

const { mockGetBlob, mockUseBilling, mockToastError } = vi.hoisted(() => ({
  mockGetBlob: vi.fn(),
  mockUseBilling: vi.fn(),
  mockToastError: vi.fn(),
}));

vi.mock('@/shared/api', () => ({
  api: { getBlob: mockGetBlob },
}));

vi.mock('../hooks', () => ({ useBilling: () => mockUseBilling() }));

vi.mock('sonner', () => ({ toast: { error: mockToastError } }));

vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, onClick }: unknown) => <button onClick={onClick}>{text}</button>,
  TableSkeleton: () => <div data-testid="skeleton" />,
}));

vi.mock('@pipeline/ui', () => ({
  Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
  TableHeader: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
  TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
  TableHead: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
  TableCell: ({ children, colSpan }: unknown) => <td colSpan={colSpan}>{children}</td>,
}));

describe('InvoiceHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.URL.createObjectURL = vi.fn(() => 'blob:url');
    window.URL.revokeObjectURL = vi.fn();
  });

  it('renders skeleton when loading', () => {
    mockUseBilling.mockReturnValue({ transactions: [], isTransactionLoading: true });
    render(<InvoiceHistory />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    mockUseBilling.mockReturnValue({ transactions: [], isTransactionLoading: false });
    render(<InvoiceHistory />);
    expect(screen.getByText('No previous invoices found.')).toBeInTheDocument();
  });

  it('renders transactions and downloads PDF', async () => {
    mockUseBilling.mockReturnValue({
      transactions: [
        {
          id: 'tx1',
          invoiceId: 'inv1',
          status: 'SUCCESS',
          createdAt: '2024-01-01',
          amount: 4900,
          currency: 'usd',
        },
      ],
      isTransactionLoading: false,
    });
    mockGetBlob.mockResolvedValue(new Blob(['pdf']));
    render(<InvoiceHistory />);

    expect(screen.getByText('inv1')).toBeInTheDocument();
    expect(screen.getByText('$49.00')).toBeInTheDocument();

    fireEvent.click(screen.getByText('PDF'));

    await waitFor(() => {
      expect(mockGetBlob).toHaveBeenCalledWith('/billing/transactions/tx1/invoice');
    });
  });
});
