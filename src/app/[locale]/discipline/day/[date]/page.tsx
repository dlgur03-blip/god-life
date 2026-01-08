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

  if (!isValidDateParam(date)) {
    redirect(`/${locale}/discipline/day/${getTodayStr()}`);
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
    <main className="min-h-screen bg-[url('/bg-grid.svg')] p-4 md:p-8 pb-20">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 -mx-4 rounded-b-xl border-b border-white/5">
          <Link href={`/discipline/day/${prevStr}`} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-primary transition-colors">
            <ChevronLeft />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
              {t('title')}
            </h1>
            <p className="text-sm text-gray-500 font-mono">{date}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/discipline/insights" className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-secondary transition-colors" title={t('insights')}>
               <TrendingUp />
            </Link>
            <Link href={`/discipline/day/${nextStr}`} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-primary transition-colors">
              <ChevronRight />
            </Link>
          </div>
        </header>

        {/* Stats Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white">{percentage}%</div>
            <div className="text-xs text-gray-500 uppercase">{t('dailyCompletion')}</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-white/10 flex items-center justify-center relative">
            <Activity className="text-secondary w-8 h-8" />
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-secondary"
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
