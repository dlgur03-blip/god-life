'use client';

import { useTranslations } from 'next-intl';
import { Eye } from 'lucide-react';
import type { UserListItem } from '@/app/actions/admin';

type Props = {
  user: UserListItem;
  onViewDetail: (userId: string) => void;
};

export default function UserTableRow({ user, onViewDetail }: Props) {
  const t = useTranslations('Admin.users');

  const totalActivity =
    user._count.destinyDays +
    user._count.successProjects +
    user._count.disciplineRules +
    user._count.epistleDays;

  return (
    <tr className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          {user.image ? (
            <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6] text-sm font-medium">
              {user.email[0].toUpperCase()}
            </div>
          )}
          <span className="text-sm text-[#e2e8f0] truncate max-w-[200px]">{user.email}</span>
        </div>
      </td>
      <td className="p-4 text-sm text-[#9ca3af] hidden md:table-cell">
        {user.name || '-'}
      </td>
      <td className="p-4 text-sm text-[#6b7280] hidden lg:table-cell">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="p-4 text-right">
        <span className="text-xs text-[#6b7280]">
          {totalActivity} {t('items')}
        </span>
      </td>
      <td className="p-4">
        <button
          onClick={() => onViewDetail(user.id)}
          className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] text-[#9ca3af] hover:text-[#e2e8f0] transition-colors"
          aria-label={t('viewDetail')}
        >
          <Eye size={16} />
        </button>
      </td>
    </tr>
  );
}
