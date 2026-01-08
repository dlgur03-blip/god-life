import { getGoalHierarchy, getAllGoals } from '@/app/actions/goals';
import GoalHierarchyView from '@/components/destiny/goals/GoalHierarchyView';
import { Link } from '@/navigation';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ChevronLeft } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';

export default async function GoalsPage() {
  const t = await getTranslations('Goals');
  const locale = await getLocale();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}`);
  }

  const [hierarchyResult, allGoalsResult] = await Promise.all([
    getGoalHierarchy(),
    getAllGoals(),
  ]);

  const goals = hierarchyResult.success ? hierarchyResult.data : [];
  const allGoals = allGoalsResult.success
    ? allGoalsResult.data.map((g) => ({ id: g.id, title: g.title, type: g.type }))
    : [];

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] pb-20">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 -mx-4 rounded-b-xl border-b border-white/5">
          <Link
            href="/"
            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-primary transition-colors"
          >
            <ChevronLeft />
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {t('title')}
            </h1>
            <p className="text-sm text-gray-500">{t('subtitle')}</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Goals Hierarchy */}
        <section className="bg-[rgba(255,255,255,0.05)] p-6 rounded-2xl border border-[rgba(255,255,255,0.05)]">
          <GoalHierarchyView goals={goals} allGoals={allGoals} />
        </section>
      </div>
    </main>
  );
}
