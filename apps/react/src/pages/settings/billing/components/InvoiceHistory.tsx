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
      const baseUrl = import.meta.env.VITE_API_URL || '';
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
    <div className="lg:col-span-2 border border-border bg-card rounded-2xl p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider uppercase text-foreground/80 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-teal-500" /> Invoice History
        </h3>
      </div>

      <div className="rounded-xl border border-border/80 overflow-hidden bg-card">
        {isTransactionLoading ? (
          <TableSkeleton rowCount={3} columnCount={5} />
        ) : (
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
              {transactions && transactions.length > 0 ? (
                transactions.map((tx) => {
                  const isPaid = tx.status === 'SUCCESS' || tx.status === 'PAID';
                  const isPending = tx.status === 'PENDING';
                  const rawId = tx.invoiceId || tx.id;
                  const displayId =
                    rawId.length > 14 ? `${rawId.slice(0, 8)}...${rawId.slice(-4)}` : rawId;
                  const isDownloading = downloadingId === tx.id;

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
                            isPaid
                              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                              : isPending
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {isPaid ? 'Paid' : tx.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right py-3 pr-4">
                        {isPaid ? (
                          <AppButton
                            variant="ghost"
                            size="xs"
                            icon={Download}
                            text="PDF"
                            isPending={isDownloading}
                            onClick={() => handleDownloadInvoice(tx.id)}
                            className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 p-0 h-auto min-h-0 border-none"
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
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
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