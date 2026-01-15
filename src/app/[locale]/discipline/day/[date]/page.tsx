import { getDisciplineData } from '@/app/actions/discipline';
import DisciplineList from '@/components/discipline/DisciplineList';
import AddRuleForm from '@/components/discipline/AddRuleForm';
import { Link } from '@/navigation';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ChevronLeft, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { isValidDateParam } from '@/lib/validateDate';
import { getTodayStr } from '@/lib/date';

export default async function DisciplinePage({ params }: { params: Promise<{ date: string }> }) {
  const t = await getTranslations('Discipline');
  const locale = await getLocale();
  const { date } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect(`/${locale}`);

  const { getUserTimezone } = await import('@/lib/timezone');
  const timezone = await getUserTimezone();
  const todayStr = getTodayStr(timezone);

  if (!isValidDateParam(date)) {
    redirect(`/${locale}/discipline/day/${todayStr}`);
  }

  const rules = await getDisciplineData(date);
  
  const completedCount = rules.filter(r => r.isChecked).length;
  const totalCount = rules.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Nav Logic
  const currentDate = new Date(date);
  const prevDate = new Date(currentDate); prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(currentDate); nextDate.setDate(nextDate.getDate() + 1);
  const prevStr = prevDate.toISOString().split('T')[0];
  const nextStr = nextDate.toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 md:p-8 pb-20">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-[72px] md:top-[120px] lg:top-[130px] z-10 bg-[var(--background)]/95 p-4 -mx-4 rounded-b-xl border-b border-[var(--color-border)]">
          <Link href={`/discipline/day/${prevStr}`} className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors">
            <ChevronLeft />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest text-[var(--color-secondary)]">
              {t('title')}
            </h1>
            <p className="text-sm text-[var(--foreground-muted)] font-mono">{date}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/discipline/insights" className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-secondary)] transition-colors" title={t('insights')}>
               <TrendingUp />
            </Link>
            <Link href={`/discipline/day/${nextStr}`} className="p-2 hover:bg-[var(--color-card-hover)] rounded-full text-[var(--foreground-muted)] hover:text-[var(--color-primary)] transition-colors">
              <ChevronRight />
            </Link>
          </div>
        </header>

        {/* Stats Card */}
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-[var(--foreground)]">{percentage}%</div>
            <div className="text-xs text-[var(--foreground-muted)] uppercase">{t('dailyCompletion')}</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-[var(--color-border)] flex items-center justify-center relative">
            <Activity className="text-[var(--color-secondary)] w-8 h-8" />
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[var(--color-secondary)]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${percentage}, 100`}
              />
            </svg>
          </div>
        </div>

        {/* Input */}
        <AddRuleForm />

        {/* List */}
        <DisciplineList rules={rules} date={date} />

      </div>
    </main>
  );
}
