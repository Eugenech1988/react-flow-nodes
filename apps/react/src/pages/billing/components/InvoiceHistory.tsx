import { Receipt, Download } from 'lucide-react';
import type { TTransaction } from '@/shared/lib';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Skeleton } from '@pipeline/ui';

interface InvoiceHistoryProps {
  transactions: TTransaction[] | undefined;
  isLoading: boolean;
}

export const InvoiceHistory = ({ transactions, isLoading }: InvoiceHistoryProps) => {
  return (
    <div className="lg:col-span-2 border border-border bg-card rounded-2xl p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider uppercase text-foreground/80 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-teal-500" /> Invoice History
        </h3>
      </div>

      <div className="rounded-xl border border-border/80 overflow-hidden bg-card">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/60 bg-muted/30">
              <TableHead className="font-semibold text-muted-foreground py-3 pl-4">Invoice</TableHead>
              <TableHead className="font-semibold text-muted-foreground py-3">Date</TableHead>
              <TableHead className="font-semibold text-muted-foreground py-3">Amount</TableHead>
              <TableHead className="font-semibold text-muted-foreground py-3">Status</TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground py-3 pr-4">
                Receipt
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx} className="border-b border-border/40">
                  <TableCell className="py-3 pl-4">
                    <Skeleton className="h-4 w-28 rounded-full" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="py-3 text-right pr-4">
                    <Skeleton className="h-4 w-10 ml-auto rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : transactions && transactions.length > 0 ? (
              transactions.map((tx) => {
                const statusText = tx.status === 'SUCCESS' || tx.status === 'PAID' ? 'Paid' : tx.status;
                const rawId = tx.invoiceId || tx.id;
                const displayId =
                  rawId.length > 14 ? `${rawId.slice(0, 8)}...${rawId.slice(-4)}` : rawId;

                return (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-muted/30 border-b border-border/40 transition-colors"
                  >
                    <TableCell
                      className="font-mono text-[11px] font-medium py-3 pl-4 text-foreground"
                      title={rawId}
                    >
                      {displayId}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-3">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium py-3 text-foreground">
                      ${(tx.amount / 100).toFixed(2)}{' '}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {tx.currency?.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                          tx.status === 'SUCCESS' || tx.status === 'PAID'
                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                            : tx.status === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {statusText}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-3 pr-4">
                      {tx.invoiceUrl ? (
                        <a
                          href={tx.invoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline font-medium text-xs transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground/50 text-xs">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                  No previous invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};