'use client';

import { useTranslations } from 'next-intl';
import GoalEditor from './GoalEditor';
import WeeklyPlanGrid from './WeeklyPlanGrid';
import { updateDestinyGoals } from '@/app/actions/destiny';

interface DestinyNavigatorCardProps {
  dayId: string;
  goalWeek: string | null;
  goalToday: string | null;
  weeklyPlans: Record<string, string | null>;
}

export default function DestinyNavigatorCard({
  dayId,
  goalWeek,
  goalToday,
  weeklyPlans,
}: DestinyNavigatorCardProps) {
  const t = useTranslations('Destiny');

  const handleWeekGoalSave = async (value: string) => {
    await updateDestinyGoals(dayId, { week: value });
  };

  const handleTodayGoalSave = async (value: string) => {
    await updateDestinyGoals(dayId, { today: value });
  };

  return (
    <section className="mb-8 space-y-6 bg-[rgba(255,255,255,0.05)] p-6 rounded-2xl border border-[rgba(255,255,255,0.05)]">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
        {t('coreObjectives')}
      </h2>

      {/* Week Goal */}
      <GoalEditor
        label={t('goals.week')}
        value={goalWeek}
        onSave={handleWeekGoalSave}
        placeholder={t('goals.weekPlaceholder')}
      />

      {/* Weekly Plan 7-Day Grid */}
      <WeeklyPlanGrid
        initialPlans={weeklyPlans}
      />

      {/* Today's Goal */}
      <GoalEditor
        label={t('goals.today')}
        value={goalToday}
        onSave={handleTodayGoalSave}
        placeholder={t('goals.todayPlaceholder')}
      />
    </section>
  );
}
