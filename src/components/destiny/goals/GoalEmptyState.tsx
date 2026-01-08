'use client';

import { useTranslations } from 'next-intl';
import { Target } from 'lucide-react';

interface GoalEmptyStateProps {
  onCreateGoal: () => void;
}

export default function GoalEmptyState({ onCreateGoal }: GoalEmptyStateProps) {
  const t = useTranslations('Goals');

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
        <Target size={40} className="text-primary" />
      </div>
      <h3 className="text-xl font-bold text-gray-200 mb-2">
        {t('emptyState.title')}
      </h3>
      <p className="text-gray-400 mb-6 max-w-md">
        {t('emptyState.description')}
      </p>
      <button
        onClick={onCreateGoal}
        className="px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors"
      >
        {t('createFirstGoal')}
      </button>
    </div>
  );
}
