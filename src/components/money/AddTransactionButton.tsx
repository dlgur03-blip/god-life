'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import { createTransaction, type TransactionType } from '@/app/actions/money';

const INCOME_CATEGORIES = ['salary', 'investment', 'bonus', 'other_income'];
const EXPENSE_CATEGORIES = ['food', 'transport', 'housing', 'utilities', 'shopping', 'entertainment', 'health', 'education', 'other_expense'];

type Props = {
  currentMonth: string;
};

export default function AddTransactionButton({ currentMonth }: Props) {
  const t = useTranslations('Money');
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createTransaction({
        type,
        category,
        amount: parseInt(amount, 10),
        memo: memo || undefined,
        date,
      });
      // Reset form
      setCategory('');
      setAmount('');
      setMemo('');
      setDate(new Date().toISOString().split('T')[0]);
      setIsOpen(false);
    } catch (e) {
      console.error('Failed to create:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Default to first day of current viewing month or today
    const today = new Date().toISOString().split('T')[0];
    if (today.startsWith(currentMonth)) {
      setDate(today);
    } else {
      setDate(`${currentMonth}-01`);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-[var(--background)]/95 border border-[var(--color-border)] rounded-2xl p-4 w-80 shadow-lg backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[var(--foreground)]">{t('addTransaction')}</h3>
            <button onClick={() => setIsOpen(false)} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setType('income'); setCategory(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                  type === 'income'
                    ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                    : 'bg-[var(--background-secondary)] text-[var(--foreground-muted)] border border-[var(--color-border)]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                {t('income')}
              </button>
              <button
                type="button"
                onClick={() => { setType('expense'); setCategory(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                  type === 'expense'
                    ? 'bg-red-500/20 text-red-500 border border-red-500/50'
                    : 'bg-[var(--background-secondary)] text-[var(--foreground-muted)] border border-[var(--color-border)]'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                {t('expense')}
              </button>
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--foreground)] focus:border-[var(--color-primary)] focus:outline-none"
              required
            >
              <option value="">{t('category')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
              ))}
            </select>

            {/* Amount */}
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={t('amount')}
              className="w-full bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--foreground)] focus:border-[var(--color-primary)] focus:outline-none placeholder:text-[var(--foreground-muted)]"
              required
              min="1"
            />

            {/* Date */}
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--foreground)] focus:border-[var(--color-primary)] focus:outline-none"
              required
            />

            {/* Memo */}
            <input
              type="text"
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder={t('memo')}
              className="w-full bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--foreground)] focus:border-[var(--color-primary)] focus:outline-none placeholder:text-[var(--foreground-muted)]"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${
                type === 'income'
                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/50'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50'
              } disabled:opacity-50`}
            >
              {isSubmitting ? '...' : type === 'income' ? t('addIncome') : t('addExpense')}
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={handleOpen}
          className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}
