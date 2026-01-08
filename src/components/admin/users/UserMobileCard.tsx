'use client';

import { useTranslations } from 'next-intl';
import { Eye, Calendar } from 'lucide-react';
import type { UserListItem } from '@/app/actions/admin';

type Props = {
  user: UserListItem;
  onViewDetail: (userId: string) => void;
};

export default function UserMobileCard({ user, onViewDetail }: Props) {
  const t = useTranslations('Admin.users');

  const totalActivity =
    user._count.destinyDays +
    user._count.successProjects +
    user._count.disciplineRules +
    user._count.epistleDays;

  return (
    <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {user.image ? (
            <img src={user.image} alt="" className="w-10 h-10 rounded-full flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6] text-sm font-medium flex-shrink-0">
              {user.email[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#e2e8f0] truncate">
              {user.name || user.email}
            </p>
            <p className="text-xs text-[#6b7280] truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => onViewDetail(user.id)}
          className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-[#9ca3af] hover:text-[#e2e8f0] transition-colors flex-shrink-0"
          aria-label={t('viewDetail')}
        >
          <Eye size={18} />
        </button>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-1 text-xs text-[#6b7280]">
          <Calendar size={12} />
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
        <span className="text-xs text-[#9ca3af]">
          {totalActivity} {t('items')}
        </span>
      </div>
    </div>
  );
}
