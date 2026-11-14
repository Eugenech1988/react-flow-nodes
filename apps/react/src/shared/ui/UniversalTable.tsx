import {
  flexRender,
  type Table,
  type SortingState,
  type ColumnDef,
  type TableFeatures,
  type RowData,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table as TableUI,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@pipeline/ui';
import { AppButton } from '@/shared/ui';
import { cn } from '@/shared/lib';

import { SortIndicator } from './SortIndicator';

type TSortDirection = 'asc' | 'desc' | false;

type TUniversalTableProps<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = Record<string, unknown>,
> = {
  table: Table<TFeatures, TData>;
  columns: ColumnDef<TFeatures, TData>[];
  sorting: SortingState;
  totalItems: number;
  page: number;
  totalPages: number;
  limit: number;
  onSort: (columnId: string) => void;
  onSelect?: (item: TData) => void;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  noDataText?: string;
  itemsUnitLabel?: string;
  maxHeight?: string;
};

export const UniversalTable = <
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = Record<string, unknown>,
>({
  table,
  columns,
  sorting,
  totalItems,
  page,
  totalPages,
  limit,
  onSort,
  onSelect,
  onPageChange,
  onLimitChange,
  noDataText = 'No items found matching your filters.',
  itemsUnitLabel = 'items',
  maxHeight = 'calc(100vh - 21.5rem)',
}: TUniversalTableProps<TFeatures, TData>) => {
  const rows = table.getRowModel().rows;
  const showFooter = totalItems > 10 || totalPages > 1;

  return (
    <div className="border-border/60 bg-card/50 flex flex-col overflow-hidden rounded-xl border shadow-xs backdrop-blur-md">
      <div className="relative overflow-x-auto overflow-y-auto" style={{ maxHeight }}>
        <TableUI className="w-full font-sans text-sm">
          <TableHeader className="bg-muted/90 sticky top-0 z-10 backdrop-blur-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border/60 border-b hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.id !== 'actions';
                  const currentSort = sorting.find((s) => s.id === header.column.id);
                  const sortState: TSortDirection = currentSort
                    ? currentSort.desc
                      ? 'desc'
                      : 'asc'
                    : false;

                  const meta = header.column.columnDef.meta as
                    { headerClassName?: string; cellClassName?: string } | undefined;

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'text-muted-foreground px-4 py-2.5 text-xs font-semibold select-none',
                        canSort ? 'hover:text-foreground cursor-pointer' : '',
                        header.index === 0 ? 'pl-4' : '',
                        header.index === headerGroup.headers.length - 1 ? 'pr-4' : '',
                        meta?.headerClassName,
                      )}
                      onClick={canSort ? () => onSort(header.column.id) : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex w-full items-center justify-start gap-1.5',
                            meta?.headerClassName,
                          )}
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {canSort && (
                            <span className="text-muted-foreground/60 shrink-0">
                              <SortIndicator state={sortState} />
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => {
                const cells = row.getAllCells();
                return (
                  <TableRow
                    key={row.id}
                    className={`hover:bg-muted/40 border-border/40 text-foreground/90 border-b text-sm font-medium transition-all ${
                      onSelect ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => onSelect?.(row.original)}
                  >
                    {cells.map((cell, idx) => {
                      const meta = cell.column.columnDef.meta as
                        { headerClassName?: string; cellClassName?: string } | undefined;

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'px-4 py-2.5 align-middle',
                            idx === 0 ? 'pl-4' : '',
                            idx === cells.length - 1 ? 'pr-4' : '',
                            meta?.cellClassName,
                          )}
                        >
                          <div
                            className={cn(
                              'flex w-full items-center justify-start',
                              meta?.cellClassName,
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground py-10 text-center text-sm font-medium"
                >
                  {noDataText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
      </div>

      {showFooter && (
        <div className="bg-muted/30 border-border/60 text-muted-foreground flex shrink-0 flex-col items-center justify-between gap-3 border-t px-4 py-2.5 text-xs font-medium sm:flex-row">
          <div className="flex items-center gap-4">
            <span>
              Showing <strong className="text-muted-foreground font-semibold">{rows.length}</strong>{' '}
              of <strong className="text-muted-foreground font-semibold">{totalItems}</strong>{' '}
              {itemsUnitLabel}
            </span>

            <div className="flex items-center gap-1.5">
              <span>Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  onLimitChange(Number(e.target.value));
                  onPageChange(1);
                }}
                className="bg-background border-border/80 text-foreground focus:ring-ring rounded-lg border px-2 py-1 text-xs focus:ring-1 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AppButton
              variant="secondary"
              size="xs"
              icon={ChevronLeft}
              isDisabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-7 w-7 rounded-lg p-0"
            />
            <span className="px-1 text-xs">
              Page {page} of {Math.max(totalPages, 1)}
            </span>
            <AppButton
              variant="secondary"
              size="xs"
              icon={ChevronRight}
              isDisabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-7 w-7 rounded-lg p-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};
