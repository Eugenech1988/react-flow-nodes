import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTable, tableFeatures, type ColumnDef, type TableFeatures } from '@tanstack/react-table';
import { UniversalTable } from './UniversalTable';

interface IRow {
  id: string;
  name: string;
}

const columns: ColumnDef<TableFeatures, IRow>[] = [
  {
    id: 'name',
    accessorFn: (row) => row.name,
    header: 'Name',
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    id: 'id',
    accessorFn: (row) => row.id,
    header: 'ID',
    cell: ({ row }) => <span>{row.original.id}</span>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => <span data-testid="actions-cell">-</span>,
  },
];

interface IWrapperProps {
  data?: IRow[];
  onSort?: (id: string) => void;
  onSelect?: (row: IRow) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  totalItems?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
  noDataText?: string;
  itemsUnitLabel?: string;
}

const TestTable = ({
  data = [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }],
  onSort = vi.fn(),
  onSelect,
  onPageChange = vi.fn(),
  onLimitChange = vi.fn(),
  totalItems = data.length,
  totalPages = 1,
  page = 1,
  limit = 10,
  noDataText,
  itemsUnitLabel,
}: IWrapperProps) => {
  const table = useTable({
    data,
    columns,
    features: tableFeatures({}),
  });

  return (
    <UniversalTable
      table={table}
      columns={columns}
      sorting={[]}
      totalItems={totalItems}
      page={page}
      totalPages={totalPages}
      limit={limit}
      onSort={onSort}
      onSelect={onSelect}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      noDataText={noDataText}
      itemsUnitLabel={itemsUnitLabel}
    />
  );
};

describe('UniversalTable', () => {
  it('renders headers', () => {
    render(<TestTable />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders rows', () => {
    render(<TestTable />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders noDataText when empty', () => {
    render(<TestTable data={[]} noDataText="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('calls onSort on sortable column click', () => {
    const onSort = vi.fn();
    render(<TestTable onSort={onSort} />);
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('does not call onSort on actions column click', () => {
    const onSort = vi.fn();
    render(<TestTable onSort={onSort} />);
    fireEvent.click(screen.getByText('Actions'));
    expect(onSort).not.toHaveBeenCalled();
  });

  it('calls onSelect on row click when provided', () => {
    const onSelect = vi.fn();
    render(<TestTable onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Alice'));
    expect(onSelect).toHaveBeenCalledWith({ id: '1', name: 'Alice' });
  });

  it('hides footer when totalItems <= 10 and totalPages <= 1', () => {
    render(<TestTable />);
    expect(screen.queryByText(/Page 1 of/)).not.toBeInTheDocument();
  });

  it('shows footer when totalItems > 10', () => {
    render(<TestTable totalItems={25} totalPages={3} />);
    expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
  });

  it('shows footer when totalPages > 1', () => {
    render(<TestTable totalItems={2} totalPages={2} />);
    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
  });

  it('calls onPageChange on next click', () => {
    const onPageChange = vi.fn();
    render(<TestTable totalItems={25} totalPages={3} onPageChange={onPageChange} />);

    const buttons = screen.getAllByRole('button');
    const nextBtn = buttons[buttons.length - 1];
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange on prev click when not on first page', () => {
    const onPageChange = vi.fn();
    render(
      <TestTable
        totalItems={25}
        totalPages={3}
        page={2}
        onPageChange={onPageChange}
      />,
    );

    const buttons = screen.getAllByRole('button');
    const prevBtn = buttons[buttons.length - 2];
    fireEvent.click(prevBtn);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onLimitChange and onPageChange on limit change', () => {
    const onLimitChange = vi.fn();
    const onPageChange = vi.fn();
    render(
      <TestTable
        totalItems={25}
        totalPages={3}
        onLimitChange={onLimitChange}
        onPageChange={onPageChange}
      />,
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '20' } });
    expect(onLimitChange).toHaveBeenCalledWith(20);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('uses custom itemsUnitLabel', () => {
    render(<TestTable totalItems={25} totalPages={3} itemsUnitLabel="rows" />);
    expect(screen.getByText(/rows/)).toBeInTheDocument();
  });
});
