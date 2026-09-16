import {
  flexRender,
  type Table,
  type SortingState,
  type ColumnDef,
  type TableFeatures,
  type RowData
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table as TableUI,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@pipeline/ui';
import { AppButton } from '@/shared/ui';

import { SortIndicator } from './SortIndicator';

type TSortDirection = 'asc' | 'desc' | false;

type TUniversalTableProps<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = Record<string, unknown>
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
};

export const UniversalTable = <
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = Record<string, unknown>
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
  }: TUniversalTableProps<TFeatures, TData>) => {
  const rows = table.getRowModel().rows;

  const showFooter = totalItems > 10 || totalPages > 1;

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden bg-card/50 backdrop-blur-md shadow-xs flex flex-col">
      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-21.5rem)] relative">
        <TableUI className="text-sm font-sans w-full">
          <TableHeader className="sticky top-0 z-10 bg-muted/90 backdrop-blur-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-border/60"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.id !== 'actions';
                  const currentSort = sorting.find(
                    (s) => s.id === header.column.id
                  );
                  const sortState: TSortDirection = currentSort
                    ? currentSort.desc
                      ? 'desc'
                      : 'asc'
                    : false;

                  return (
                    <TableHead
                      key={header.id}
                      className={`font-semibold text-muted-foreground text-xs py-2.5 px-4 select-none ${
                        canSort ? 'cursor-pointer hover:text-foreground' : ''
                      } ${header.index === 0 ? 'pl-4' : ''} ${
                        header.index === headerGroup.headers.length - 1 ? 'pr-4' : ''
                      }`}
                      onClick={
                        canSort ? () => onSort(header.column.id) : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex w-full items-center justify-center gap-1.5">
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
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
                    className={`hover:bg-muted/40 border-b border-border/40 transition-all text-sm font-medium text-foreground/90 ${
                      onSelect ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => onSelect?.(row.original)}
                  >
                    {cells.map((cell, idx) => (
                      <TableCell
                        key={cell.id}
                        className={`py-2.5 px-4 align-middle ${idx === 0 ? 'pl-4' : ''} ${
                          idx === cells.length - 1 ? 'pr-4' : ''
                        }`}
                      >
                        <div className="flex w-full items-center justify-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10 text-muted-foreground text-sm font-medium"
                >
                  {noDataText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
      </div>

      {showFooter && (
        <div className="bg-muted/30 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between px-4 py-2.5 gap-3 text-xs font-medium text-muted-foreground shrink-0">
          <div className="flex items-center gap-4">
            <span>
              Showing <strong className="text-muted-foreground font-semibold">{rows.length}</strong> of{' '}
              <strong className="text-muted-foreground font-semibold">{totalItems}</strong> {itemsUnitLabel}
            </span>

            <div className="flex items-center gap-1.5">
              <span>Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  onLimitChange(Number(e.target.value));
                  onPageChange(1);
                }}
                className="bg-background border border-border/80 rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
              className="h-7 w-7 p-0 rounded-lg"
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
              className="h-7 w-7 p-0 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};