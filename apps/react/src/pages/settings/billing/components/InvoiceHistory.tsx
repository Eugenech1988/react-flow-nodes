import { useState } from 'react';
import { Receipt, Download } from 'lucide-react';
import { api } from '@/shared/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@pipeline/ui';
import { useBilling } from '../hooks';
import { TableSkeleton, AppButton } from '@/shared/ui';

export const InvoiceHistory = () => {
  const { transactions, isTransactionLoading } = useBilling();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadInvoice = async (transactionId: string) => {
    try {
      setDownloadingId(transactionId);
      const baseUrl = import.meta.env.VITE_API_URL;
      const blob = await api.getBlob(`${baseUrl}/billing/transactions/${transactionId}/invoice`, {
        credentials: 'include',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${transactionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="border-border bg-card space-y-4 rounded-2xl border p-6 shadow-xs lg:col-span-2">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground/80 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
          <Receipt className="h-4 w-4 text-teal-500" /> Invoice History
        </h3>
      </div>

      <div className="border-border/80 bg-card overflow-hidden rounded-xl border">
        {isTransactionLoading ? (
          <TableSkeleton rowCount={3} columnCount={5} />
        ) : (
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="border-border/60 bg-muted/30 border-b hover:bg-transparent">
                <TableHead className="text-muted-foreground py-3 pl-4 font-semibold">
                  Invoice
                </TableHead>
                <TableHead className="text-muted-foreground py-3 font-semibold">Date</TableHead>
                <TableHead className="text-muted-foreground py-3 font-semibold">Amount</TableHead>
                <TableHead className="text-muted-foreground py-3 font-semibold">Status</TableHead>
                <TableHead className="text-muted-foreground py-3 pr-4 text-right font-semibold">
                  Receipt
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions && transactions.length > 0 ? (
                transactions.map((tx) => {
                  const isPaid = tx.status === 'SUCCESS';
                  const isPending = tx.status === 'PENDING';
                  const rawId = tx.invoiceId || tx.id;
                  const displayId =
                    rawId.length > 14 ? `${rawId.slice(0, 8)}...${rawId.slice(-4)}` : rawId;
                  const isDownloading = downloadingId === tx.id;

                  return (
                    <TableRow
                      key={tx.id}
                      className="hover:bg-muted/30 border-border/40 border-b transition-colors"
                    >
                      <TableCell
                        className="text-foreground py-3 pl-4 font-mono text-[11px] font-medium"
                        title={rawId}
                      >
                        {displayId}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-3">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-foreground py-3 font-medium">
                        ${(tx.amount / 100).toFixed(2)}{' '}
                        <span className="text-muted-foreground text-[10px] font-normal">
                          {tx.currency?.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                            isPaid
                              ? 'border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                              : isPending
                                ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isPaid ? 'Paid' : tx.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pr-4 text-right">
                        {isPaid ? (
                          <AppButton
                            variant="ghost"
                            size="xs"
                            icon={Download}
                            text="PDF"
                            isPending={isDownloading}
                            onClick={() => handleDownloadInvoice(tx.id)}
                            className="h-auto min-h-0 border-none p-0 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                          />
                        ) : (
                          <span className="text-muted-foreground/50 text-xs">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground py-8 text-center text-xs">
                    No previous invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
