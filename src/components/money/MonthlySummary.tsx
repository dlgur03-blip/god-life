'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

type Props = {
  income: number;
  expense: number;
  balance: number;
};

export default function MonthlySummary({ income, expense, balance }: Props) {
  const t = useTranslations('Money');

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <section className="grid grid-cols-3 gap-3 mb-8">
      {/* Income */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-xs text-[var(--foreground-muted)]">{t('income')}</span>
        </div>
        <p className="text-lg font-bold text-green-500">
          +{formatAmount(income)}
        </p>
      </div>

      {/* Expense */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="text-xs text-[var(--foreground-muted)]">{t('expense')}</span>
        </div>
        <p className="text-lg font-bold text-red-500">
          -{formatAmount(expense)}
        </p>
      </div>

      {/* Balance */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          <Wallet className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="text-xs text-[var(--foreground-muted)]">{t('balance')}</span>
        </div>
        <p className={`text-lg font-bold ${balance >= 0 ? 'text-[var(--color-primary)]' : 'text-red-500'}`}>
          {balance >= 0 ? '+' : ''}{formatAmount(balance)}
        </p>
      </div>
    </section>
  );
}
