import {
  flexRender,
  type Table,
  type SortingState,
  type ColumnDef,
  type TableFeatures,
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

import { SortIndicator } from './SortIndicator';
import type { IExecutionItem, TSortState } from '@/pages/executions/model';

type TExecutionsTableProps<TFeatures extends TableFeatures = TableFeatures> = {
  table: Table<TFeatures, IExecutionItem>;
  columns: ColumnDef<TFeatures, IExecutionItem>[];
  sorting: SortingState;
  totalRuns: number;
  onSort: (columnId: string) => void;
  onSelect: (item: IExecutionItem) => void;
};

export const ExecutionsTable = <TFeatures extends TableFeatures = TableFeatures>({
                                                                                   table,
                                                                                   columns,
                                                                                   sorting,
                                                                                   totalRuns,
                                                                                   onSort,
                                                                                   onSelect,
                                                                                 }: TExecutionsTableProps<TFeatures>) => {
  const rows = table.getRowModel().rows;

  return (
    <div className="rounded-xl border border-border/80 overflow-hidden bg-card shadow-xs">
      <div className="overflow-x-auto">
        <TableUI className="text-xs">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-border/60 bg-muted/30"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.id !== 'actions';
                  const currentSort = sorting.find(
                    (s) => s.id === header.column.id
                  );
                  const sortState: TSortState = currentSort
                    ? currentSort.desc
                      ? 'desc'
                      : 'asc'
                    : false;
                  const isLast =
                    header.index === headerGroup.headers.length - 1;

                  return (
                    <TableHead
                      key={header.id}
                      className={`font-semibold text-muted-foreground py-3 select-none ${
                        canSort ? 'cursor-pointer hover:text-foreground' : ''
                      } ${header.index === 0 ? 'pl-4' : ''} ${
                        isLast ? 'pr-4 text-right' : ''
                      }`}
                      onClick={
                        canSort ? () => onSort(header.column.id) : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`inline-flex items-center gap-1.5 ${
                            isLast ? 'justify-end w-full' : ''
                          }`}
                        >
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
                    className="hover:bg-muted/30 border-b border-border/40 transition-colors cursor-pointer text-xs"
                    onClick={() => onSelect(row.original)}
                  >
                    {cells.map((cell, idx) => (
                      <TableCell
                        key={cell.id}
                        className={`py-3 ${idx === 0 ? 'pl-4' : ''} ${
                          idx === cells.length - 1 ? 'pr-4' : ''
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground text-xs"
                >
                  No executions found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
      </div>

      <div className="bg-muted/10 border-t border-border/60 flex items-center justify-between px-4 py-3 text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{rows.length}</strong> of{' '}
          <strong className="text-foreground">{totalRuns}</strong> runs
        </span>
        <div className="flex items-center gap-1.5">
          <AppButton
            variant="regular"
            size="xs"
            icon={ChevronLeft}
            isDisabled
            className="h-7 w-7 p-0 rounded-md"
          />
          <span className="px-1 text-[11px]">Page 1 of 1</span>
          <AppButton
            variant="regular"
            size="xs"
            icon={ChevronRight}
            isDisabled
            className="h-7 w-7 p-0 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};