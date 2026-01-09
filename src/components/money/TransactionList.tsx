'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { deleteTransaction, type Transaction } from '@/app/actions/money';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

type Props = {
  transactions: Transaction[];
};

export default function TransactionList({ transactions }: Props) {
  const t = useTranslations('Money');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deleteId);
    } catch (e) {
      console.error('Failed to delete:', e);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Group by date
  const groupedByDate = transactions.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  if (transactions.length === 0) {
    return (
      <section className="text-center py-12 text-[var(--foreground-muted)]">
        <p>{t('noTransactions')}</p>
      </section>
    );
  }

  return (
    <>
      <section className="space-y-6">
        <h2 className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wider px-2">
          {t('transactions')}
        </h2>

        {sortedDates.map(date => (
          <div key={date}>
            <p className="text-xs text-[var(--foreground-muted)] mb-2 px-2 font-mono">{date}</p>
            <div className="space-y-2">
              {groupedByDate[date].map(tx => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 group hover:border-[var(--color-border-hover)] transition-colors"
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {tx.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {t(`categories.${tx.category}`)}
                    </p>
                    {tx.memo && (
                      <p className="text-xs text-[var(--foreground-muted)] truncate">
                        {tx.memo}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <p className={`text-sm font-bold shrink-0 ${
                    tx.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                  </p>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteId(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-[var(--foreground-muted)] hover:text-red-500 transition-all sm:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <ConfirmDialog
        isOpen={!!deleteId}
        title={t('delete')}
        message={t('deleteConfirm')}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
