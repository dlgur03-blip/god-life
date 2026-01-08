'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import type { UserDetail } from '@/app/actions/admin';
import { cn } from '@/lib/utils';
import { errorCodeToTranslationKey, type ErrorCode } from '@/lib/errors';

type Props = {
  user: {
    id: string;
    email: string;
    name: string | null;
    stats: UserDetail['stats']
  };
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
};

const statKeys = [
  'destinyDays', 'destinyEvents', 'destinyTemplates',
  'successProjects', 'successEntries',
  'disciplineRules', 'disciplineChecks',
  'epistleDays', 'weeklyPlans'
] as const;

export default function DeleteUserDialog({ user, onConfirm, onCancel, loading, error }: Props) {
  const t = useTranslations('Admin.users');
  const tCommon = useTranslations('Common');

  const nonZeroStats = statKeys.filter(key => user.stats[key] > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)]" onClick={onCancel} />

      <div className={cn(
        'relative z-10 w-full max-w-md',
        'rounded-2xl bg-[#050b14] border border-[rgba(255,255,255,0.1)]',
        'shadow-2xl p-6'
      )}>
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-full bg-[rgba(239,68,68,0.2)]">
            <AlertTriangle className="text-[#ef4444]" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#e2e8f0] mb-1">
              {t('deleteConfirm')}
            </h3>
            <p className="text-sm text-[#9ca3af] mb-2">
              {t('deleteWarning')}
            </p>
            <p className="text-sm font-medium text-[#e2e8f0]">
              {user.name || user.email}
            </p>
          </div>
        </div>

        {/* Data to be deleted */}
        {nonZeroStats.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-[rgba(255,255,255,0.05)]">
            <p className="text-xs text-[#9ca3af] mb-2">{t('deleteWarningItems')}</p>
            <ul className="space-y-1">
              {nonZeroStats.map(key => (
                <li key={key} className="text-sm text-[#6b7280] flex justify-between">
                  <span>{t(`stats.${key}`)}</span>
                  <span className="text-[#ef4444]">{user.stats[key]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[rgba(239,68,68,0.2)] border border-[rgba(239,68,68,0.3)]">
            <p className="text-sm text-[#ef4444]">
              {tCommon(errorCodeToTranslationKey[error as ErrorCode] || 'errors.unknown')}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg',
              'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]',
              'text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.1)]',
              'transition-colors disabled:opacity-50'
            )}
          >
            {tCommon('cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg',
              'bg-[#ef4444] hover:bg-[#dc2626]',
              'text-white font-medium',
              'transition-colors disabled:opacity-50'
            )}
          >
            {loading ? t('deleting') : tCommon('delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
