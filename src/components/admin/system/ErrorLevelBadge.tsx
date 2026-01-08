'use client';

import { cn } from '@/lib/utils';
import type { ErrorLogLevel } from '@/app/actions/admin';

type ErrorLevelBadgeProps = {
  level: ErrorLogLevel;
};

export default function ErrorLevelBadge({ level }: ErrorLevelBadgeProps) {
  const levelStyles = {
    error: 'bg-[rgba(239,68,68,0.2)] text-[#ef4444] border-[rgba(239,68,68,0.3)]',
    warning: 'bg-[rgba(245,158,11,0.2)] text-[#f59e0b] border-[rgba(245,158,11,0.3)]',
    info: 'bg-[rgba(6,182,212,0.2)] text-[#06b6d4] border-[rgba(6,182,212,0.3)]'
  };

  const levelLabels = {
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
      'text-sm font-medium border',
      levelStyles[level]
    )}>
      <span className={cn(
        'w-2 h-2 rounded-full',
        level === 'error' && 'bg-[#ef4444]',
        level === 'warning' && 'bg-[#f59e0b]',
        level === 'info' && 'bg-[#06b6d4]'
      )} />
      {levelLabels[level]}
    </span>
  );
}
