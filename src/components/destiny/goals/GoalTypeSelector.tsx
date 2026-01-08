'use client';

import { GoalType } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { GOAL_COLORS } from '@/lib/goal-colors';
import { GOAL_TYPE_ORDER } from '@/types/goals';

interface GoalTypeSelectorProps {
  value: GoalType | null;
  onChange: (type: GoalType) => void;
  excludeTypes?: GoalType[];
}

export default function GoalTypeSelector({
  value,
  onChange,
  excludeTypes = [],
}: GoalTypeSelectorProps) {
  const t = useTranslations('Goals');

  const availableTypes = GOAL_TYPE_ORDER.filter(
    (type) => !excludeTypes.includes(type)
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {availableTypes.map((type) => {
        const colors = GOAL_COLORS[type];
        const isSelected = value === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              'px-3 py-2 rounded-lg border text-sm font-medium transition-all',
              'hover:scale-105',
              isSelected
                ? 'ring-2 ring-offset-2 ring-offset-black'
                : 'opacity-70 hover:opacity-100'
            )}
            style={{
              backgroundColor: isSelected ? colors.bg : 'transparent',
              borderColor: colors.border,
              color: colors.primary,
              ...(isSelected && { ringColor: colors.primary }),
            }}
          >
            {t(`types.${type.toLowerCase()}`)}
          </button>
        );
      })}
    </div>
  );
}
