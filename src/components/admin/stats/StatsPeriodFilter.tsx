'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { StatsPeriod } from '@/app/actions/admin';

type StatsPeriodFilterProps = {
  selected: StatsPeriod;
  onChange: (period: StatsPeriod) => void;
};

export default function StatsPeriodFilter({ selected, onChange }: StatsPeriodFilterProps) {
  const t = useTranslations('Admin.stats');

  const periods: { value: StatsPeriod; label: string }[] = [
    { value: 'week', label: t('period.week') },
    { value: 'month', label: t('period.month') },
    { value: 'quarter', label: t('period.quarter') },
  ];

  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            selected === period.value
              ? 'bg-[#8b5cf6] text-white'
              : 'bg-[rgba(255,255,255,0.05)] text-[#9ca3af] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#e2e8f0]'
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
