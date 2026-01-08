'use client';

import { GoalStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface GoalStatusBadgeProps {
  status: GoalStatus;
}

export default function GoalStatusBadge({ status }: GoalStatusBadgeProps) {
  const t = useTranslations('Goals');

  const statusStyles: Record<GoalStatus, string> = {
    ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
    COMPLETED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    PAUSED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <span
      className={cn(
        'px-2 py-0.5 text-xs rounded-full border',
        statusStyles[status]
      )}
    >
      {t(`status.${status.toLowerCase()}`)}
    </span>
  );
}
