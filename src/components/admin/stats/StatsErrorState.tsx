'use client';

import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type StatsErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export default function StatsErrorState({ message, onRetry }: StatsErrorStateProps) {
  const t = useTranslations('Common');

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12',
      'text-[#ef4444]'
    )}>
      <AlertCircle className="w-12 h-12 mb-3" />
      <p className="text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[rgba(255,255,255,0.1)] rounded-lg text-sm text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.15)] transition-colors"
        >
          {t('retry')}
        </button>
      )}
    </div>
  );
}
