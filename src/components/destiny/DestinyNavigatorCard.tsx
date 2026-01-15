'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp } from 'lucide-react';
import GoalEditor from './GoalEditor';
import WeeklyPlanGrid from './WeeklyPlanGrid';
import { updateDestinyGoals } from '@/app/actions/destiny';

interface DestinyNavigatorCardProps {
  dayId: string;
  goalUltimate: string | null;
  goal10Year: string | null;
  goal5Year: string | null;
  goal3Year: string | null;
  goal1Year: string | null;
  goal6Month: string | null;
  goal3Month: string | null;
  goal1Month: string | null;
  goal2Week: string | null;
  goal1Week: string | null;
  goalToday: string | null;
  habitToKeep: string | null;
  habitToRemove: string | null;
  restTime: string | null;
  weeklyPlans: Array<{ id: string; content: string }>;
  isEditable?: boolean;
}

export default function DestinyNavigatorCard({
  dayId,
  goalUltimate,
  goal10Year,
  goal5Year,
  goal3Year,
  goal1Year,
  goal6Month,
  goal3Month,
  goal1Month,
  goal2Week,
  goal1Week,
  goalToday,
  habitToKeep,
  habitToRemove,
  restTime,
  weeklyPlans,
  isEditable = true,
}: DestinyNavigatorCardProps) {
  const t = useTranslations('Destiny');
  const [isLongTermExpanded, setIsLongTermExpanded] = useState(false);

  const handleGoalSave = (field: string) => async (value: string) => {
    if (!isEditable) return;
    await updateDestinyGoals(dayId, { [field]: value });
  };

  return (
    <section className="mb-8 space-y-6 bg-[var(--color-card-bg)] p-6 rounded-2xl border border-[var(--color-border)]">
      <h2 className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
        {t('coreObjectives')}
      </h2>

      {/* Collapsible Long-Term Goals - Hidden by default on mobile */}
      <div className="md:contents">
        <button
          onClick={() => setIsLongTermExpanded(!isLongTermExpanded)}
          className="md:hidden w-full flex items-center justify-between py-2 px-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--color-border)] text-sm text-[var(--foreground-muted)]"
        >
          <span>{t('longTermGoals')}</span>
          {isLongTermExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <div className={`space-y-6 ${isLongTermExpanded ? 'block' : 'hidden'} md:block`}>
          {/* Ultimate Goal */}
          <GoalEditor
            label={t('goals.ultimate')}
            value={goalUltimate}
            onSave={handleGoalSave('ultimate')}
            placeholder={t('goals.ultimatePlaceholder')}
            variant="ultimate"
            readOnly={!isEditable}
          />

          {/* 10 Year Goal */}
          <GoalEditor
            label={t('goals.tenYear')}
            value={goal10Year}
            onSave={handleGoalSave('tenYear')}
            placeholder={t('goals.tenYearPlaceholder')}
            variant="longTerm"
            readOnly={!isEditable}
          />

          {/* 5 Year Goal */}
          <GoalEditor
            label={t('goals.fiveYear')}
            value={goal5Year}
            onSave={handleGoalSave('fiveYear')}
            placeholder={t('goals.fiveYearPlaceholder')}
            variant="longTerm"
            readOnly={!isEditable}
          />

          {/* 3 Year Goal */}
          <GoalEditor
            label={t('goals.threeYear')}
            value={goal3Year}
            onSave={handleGoalSave('threeYear')}
            placeholder={t('goals.threeYearPlaceholder')}
            variant="longTerm"
            readOnly={!isEditable}
          />

          {/* 1 Year Goal */}
          <GoalEditor
            label={t('goals.oneYear')}
            value={goal1Year}
            onSave={handleGoalSave('oneYear')}
            placeholder={t('goals.oneYearPlaceholder')}
            variant="month"
            readOnly={!isEditable}
          />

          {/* 6 Month Goal */}
          <GoalEditor
            label={t('goals.sixMonth')}
            value={goal6Month}
            onSave={handleGoalSave('sixMonth')}
            placeholder={t('goals.sixMonthPlaceholder')}
            variant="month"
            readOnly={!isEditable}
          />

          {/* 3 Month Goal */}
          <GoalEditor
            label={t('goals.threeMonth')}
            value={goal3Month}
            onSave={handleGoalSave('threeMonth')}
            placeholder={t('goals.threeMonthPlaceholder')}
            variant="month"
            readOnly={!isEditable}
          />

          {/* 1 Month Goal */}
          <GoalEditor
            label={t('goals.oneMonth')}
            value={goal1Month}
            onSave={handleGoalSave('oneMonth')}
            placeholder={t('goals.oneMonthPlaceholder')}
            variant="week"
            readOnly={!isEditable}
          />

          {/* 2 Week Goal */}
          <GoalEditor
            label={t('goals.twoWeek')}
            value={goal2Week}
            onSave={handleGoalSave('twoWeek')}
            placeholder={t('goals.twoWeekPlaceholder')}
            variant="week"
            readOnly={!isEditable}
          />

          {/* 1 Week Goal */}
          <GoalEditor
            label={t('goals.oneWeek')}
            value={goal1Week}
            onSave={handleGoalSave('oneWeek')}
            placeholder={t('goals.oneWeekPlaceholder')}
            variant="week"
            readOnly={!isEditable}
          />

          {/* Weekly Plan 7-Day Grid */}
          <WeeklyPlanGrid
            initialPlans={weeklyPlans}
            readOnly={!isEditable}
          />
        </div>
      </div>

      {/* Today's Goal */}
      <GoalEditor
        label={t('goals.today')}
        value={goalToday}
        onSave={handleGoalSave('today')}
        placeholder={t('goals.todayPlaceholder')}
        variant="today"
        readOnly={!isEditable}
      />

      {/* Habit to Keep */}
      <GoalEditor
        label={t('goals.habitToKeep')}
        value={habitToKeep}
        onSave={handleGoalSave('habitToKeep')}
        placeholder={t('goals.habitToKeepPlaceholder')}
        variant="habit"
        readOnly={!isEditable}
      />

      {/* Habit to Remove */}
      <GoalEditor
        label={t('goals.habitToRemove')}
        value={habitToRemove}
        onSave={handleGoalSave('habitToRemove')}
        placeholder={t('goals.habitToRemovePlaceholder')}
        variant="habit"
        readOnly={!isEditable}
      />

      {/* Rest Time Allocation */}
      <GoalEditor
        label={t('goals.restTime')}
        value={restTime}
        onSave={handleGoalSave('restTime')}
        placeholder={t('goals.restTimePlaceholder')}
        variant="today"
        readOnly={!isEditable}
      />
    </section>
  );
}
