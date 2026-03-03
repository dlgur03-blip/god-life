'use client';

import { useTranslations } from 'next-intl';
import { Brain } from 'lucide-react';

export default function MetLoading() {
  const t = useTranslations('Met');

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-8">
      {/* Animated brain icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-[var(--color-secondary)] flex items-center justify-center animate-pulse">
          <Brain className="w-10 h-10 text-[var(--color-secondary)]" />
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-[var(--color-accent)]" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-lg font-medium text-[var(--foreground)]">
          {t('analyzing')}
        </p>
        <p className="text-sm text-[var(--foreground-muted)]">
          {t('analyzingTip')}
        </p>
      </div>
    </div>
  );
}
