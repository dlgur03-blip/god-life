import { getGoalsByType } from '@/app/actions/goals';
import { Link } from '@/navigation';
import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ChevronLeft } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { GoalType } from '@prisma/client';
import { GOAL_COLORS } from '@/lib/goal-colors';
import { GOAL_TYPE_ORDER } from '@/types/goals';
import GoalProgressBar from '@/components/destiny/goals/GoalProgressBar';
import GoalStatusBadge from '@/components/destiny/goals/GoalStatusBadge';

interface GoalTypePageProps {
  params: Promise<{ type: string }>;
}

export default async function GoalTypePage({ params }: GoalTypePageProps) {
  const t = await getTranslations('Goals');
  const locale = await getLocale();
  const session = await getServerSession(authOptions);
  const { type } = await params;

  if (!session) {
    redirect(`/${locale}`);
  }

  // Validate type parameter
  const goalType = type.toUpperCase() as GoalType;
  if (!GOAL_TYPE_ORDER.includes(goalType)) {
    notFound();
  }

  const result = await getGoalsByType(goalType);
  const goals = result.success ? result.data : [];
  const colors = GOAL_COLORS[goalType];

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] pb-20">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 -mx-4 rounded-b-xl border-b border-white/5">
          <Link
            href="/destiny/goals"
            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-primary transition-colors"
          >
            <ChevronLeft />
          </Link>
          <div className="text-center">
            <h1
              className="text-2xl font-bold tracking-widest"
              style={{ color: colors.primary }}
            >
              {t(`types.${goalType.toLowerCase()}`)}
            </h1>
            <p className="text-sm text-gray-500">
              {goals.length} {t('goalsCount')}
            </p>
          </div>
          <div className="w-10" />
        </header>

        {/* Goals List */}
        <section className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400">{t('noGoalsOfType')}</p>
              <Link
                href="/destiny/goals"
                className="inline-block mt-4 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
              >
                {t('goToHierarchy')}
              </Link>
            </div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-200">
                    {goal.title}
                  </h3>
                  <GoalStatusBadge status={goal.status} />
                </div>
                {goal.description && (
                  <p className="text-sm text-gray-400 mb-3">
                    {goal.description}
                  </p>
                )}
                <GoalProgressBar progress={goal.progress} color={colors.primary} />
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
