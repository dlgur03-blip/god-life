'use client';

import { useTranslations } from 'next-intl';

interface MetProgressProps {
  current: number;
  total: number;
}

export default function MetProgress({ current, total }: MetProgressProps) {
  const t = useTranslations('Met');
  const percent = Math.round((current / total) * 100);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[var(--foreground-muted)]">
          {t('progress', { current, total })}
        </span>
        <span className="text-sm font-medium text-[var(--color-secondary)]">
          {percent}%
        </span>
      </div>
      <div
        className="w-full h-2 bg-[var(--color-border)] overflow-hidden"
        style={{ borderRadius: 'var(--radius-full)' }}
      >
        <div
          className="h-full bg-[var(--color-secondary)] transition-all duration-500 ease-out"
          style={{ width: `${percent}%`, borderRadius: 'var(--radius-full)' }}
        />
      </div>
    </div>
  );
}
