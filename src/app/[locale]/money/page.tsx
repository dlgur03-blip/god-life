import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTranslations, getLocale } from 'next-intl/server';
import { getMonthTransactions, getMonthSummary } from '@/app/actions/money';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/navigation';
import TransactionList from '@/components/money/TransactionList';
import AddTransactionButton from '@/components/money/AddTransactionButton';
import MonthlySummary from '@/components/money/MonthlySummary';

export default async function MoneyPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const t = await getTranslations('Money');
  const locale = await getLocale();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}`);
  }

  const params = await searchParams;

  // Get current month or from query param
  const today = new Date();
  const currentMonth = params.month || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  // Parse month for navigation
  const [year, month] = currentMonth.split('-').map(Number);
  const prevMonth = month === 1
    ? `${year - 1}-12`
    : `${year}-${String(month - 1).padStart(2, '0')}`;
  const nextMonth = month === 12
    ? `${year + 1}-01`
    : `${year}-${String(month + 1).padStart(2, '0')}`;

  // Fetch data
  const [transactions, summary] = await Promise.all([
    getMonthTransactions(currentMonth),
    getMonthSummary(currentMonth),
  ]);

  // Format month display
  const monthDisplay = new Date(year, month - 1).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20">
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-md p-4 -mx-4 rounded-b-xl border-b border-[var(--color-border)]">
          <Link
            href={`/money?month=${prevMonth}`}
            className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ChevronLeft />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest text-[var(--color-secondary)]">
              {t('title')}
            </h1>
            <p className="text-sm text-[var(--foreground-muted)] font-mono">{monthDisplay}</p>
          </div>
          <Link
            href={`/money?month=${nextMonth}`}
            className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ChevronRight />
          </Link>
        </header>

        {/* Summary */}
        <MonthlySummary
          income={summary.income}
          expense={summary.expense}
          balance={summary.balance}
        />

        {/* Transaction List */}
        <TransactionList transactions={transactions} />

        {/* Add Button */}
        <AddTransactionButton currentMonth={currentMonth} />
      </div>
    </main>
  );
}
