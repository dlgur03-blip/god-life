'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { X, Trash2, Calendar, RefreshCw } from 'lucide-react';
import type { UserDetail } from '@/app/actions/admin';
import { cn } from '@/lib/utils';

type Props = {
  user: UserDetail;
  onClose: () => void;
  onDelete: () => void;
};

const statKeys = [
  'destinyDays', 'destinyEvents', 'destinyTemplates',
  'successProjects', 'successEntries',
  'disciplineRules', 'disciplineChecks',
  'epistleDays', 'weeklyPlans'
] as const;

export default function UserDetailModal({ user, onClose, onDelete }: Props) {
  const t = useTranslations('Admin.users');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-detail-title"
    >
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)]" onClick={onClose} />

      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto',
          'rounded-2xl bg-[#050b14] border border-[rgba(255,255,255,0.1)]',
          'shadow-2xl'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#050b14] border-b border-[rgba(255,255,255,0.1)] p-4 flex items-center justify-between">
          <h2 id="user-detail-title" className="text-lg font-bold text-[#e2e8f0]">
            {t('userDetail')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] text-[#9ca3af] hover:text-[#e2e8f0] transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {user.image ? (
              <img src={user.image} alt="" className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6] text-2xl font-bold">
                {user.email[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-[#e2e8f0]">{user.name || '-'}</h3>
              <p className="text-sm text-[#9ca3af]">{user.email}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                <Calendar size={14} />
                {t('memberSince')}
              </div>
              <p className="text-sm text-[#e2e8f0]">{formatDate(user.createdAt)}</p>
            </div>
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-2 text-[#6b7280] text-xs mb-1">
                <RefreshCw size={14} />
                {t('lastUpdated')}
              </div>
              <p className="text-sm text-[#e2e8f0]">{formatDate(user.updatedAt)}</p>
            </div>
          </div>

          {/* Module Activity */}
          <h4 className="text-sm font-medium text-[#9ca3af] mb-3">{t('moduleActivity')}</h4>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {statKeys.map((key) => (
              <div
                key={key}
                className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-center"
              >
                <p className="text-lg font-bold text-[#e2e8f0]">{user.stats[key]}</p>
                <p className="text-xs text-[#6b7280]">{t(`stats.${key}`)}</p>
              </div>
            ))}
          </div>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
              'bg-[rgba(239,68,68,0.2)] border border-[rgba(239,68,68,0.3)]',
              'text-[#ef4444] hover:bg-[rgba(239,68,68,0.3)]',
              'transition-colors'
            )}
          >
            <Trash2 size={18} />
            {t('deleteUser')}
          </button>
        </div>
      </div>
    </div>
  );
}
