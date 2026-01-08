'use client';

import { useTranslations } from 'next-intl';
import GoalEditor from './GoalEditor';
import WeeklyPlanGrid from './WeeklyPlanGrid';
import { updateDestinyGoals } from '@/app/actions/destiny';

interface DestinyNavigatorCardProps {
  dayId: string;
  goalUltimate: string | null;
  goalLong: string | null;
  goalMonth: string | null;
  goalWeek: string | null;
  goalToday: string | null;
  weeklyPlans: Record<string, string | null>;
}

export default function DestinyNavigatorCard({
  dayId,
  goalUltimate,
  goalLong,
  goalMonth,
  goalWeek,
  goalToday,
  weeklyPlans,
}: DestinyNavigatorCardProps) {
  const t = useTranslations('Destiny');

  const handleUltimateGoalSave = async (value: string) => {
    await updateDestinyGoals(dayId, { ultimate: value });
  };

  const handleLongGoalSave = async (value: string) => {
    await updateDestinyGoals(dayId, { long: value });
  };

  const handleMonthGoalSave = async (value: string) => {
    await updateDestinyGoals(dayId, { month: value });
  };

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

      {/* Ultimate Goal */}
      <GoalEditor
        label={t('goals.ultimate')}
        value={goalUltimate}
        onSave={handleUltimateGoalSave}
        placeholder={t('goals.ultimatePlaceholder')}
        variant="ultimate"
      />

      {/* Long-term Goal */}
      <GoalEditor
        label={t('goals.longTerm')}
        value={goalLong}
        onSave={handleLongGoalSave}
        placeholder={t('goals.longTermPlaceholder')}
        variant="longTerm"
      />

      {/* Month Goal */}
      <GoalEditor
        label={t('goals.month')}
        value={goalMonth}
        onSave={handleMonthGoalSave}
        placeholder={t('goals.monthPlaceholder')}
        variant="month"
      />

      {/* Week Goal */}
      <GoalEditor
        label={t('goals.week')}
        value={goalWeek}
        onSave={handleWeekGoalSave}
        placeholder={t('goals.weekPlaceholder')}
        variant="week"
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
        variant="today"
      />
    </section>
  );
}
