'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import type { UserListItem, UserDetail } from '@/app/actions/admin';
import { getAdminUserDetail, deleteAdminUser } from '@/app/actions/admin';
import UserTableRow from './UserTableRow';
import UserMobileCard from './UserMobileCard';
import UserDetailModal from './UserDetailModal';
import DeleteUserDialog from './DeleteUserDialog';
import UserEmptyState from './UserEmptyState';
import { cn } from '@/lib/utils';

type Props = {
  users: UserListItem[];
  hasSearch: boolean;
};

export default function UserTable({ users, hasSearch }: Props) {
  const t = useTranslations('Admin.users');
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleViewDetail = async (userId: string) => {
    if (isLoadingDetail) return;
    setIsLoadingDetail(true);
    try {
      const result = await getAdminUserDetail(userId);
      if (result.success) {
        setSelectedUser(result.data);
      }
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleDeleteClick = () => {
    if (selectedUser) {
      setDeleteTarget(selectedUser);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteAdminUser(deleteTarget.id);
      if (result.success) {
        setDeleteTarget(null);
        setSelectedUser(null);
        router.refresh();
      } else {
        setDeleteError(result.error);
      }
    } finally {
      setDeleting(false);
    }
  };

  if (users.length === 0) {
    return <UserEmptyState type={hasSearch ? 'no-results' : 'no-users'} />;
  }

  return (
    <>
      {/* Desktop Table */}
      <div className={cn(
        'hidden md:block rounded-2xl overflow-hidden',
        'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
      )}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.1)]">
              <th className="text-left p-4 text-sm font-medium text-[#9ca3af]">{t('email')}</th>
              <th className="text-left p-4 text-sm font-medium text-[#9ca3af] hidden md:table-cell">{t('name')}</th>
              <th className="text-left p-4 text-sm font-medium text-[#9ca3af] hidden lg:table-cell">{t('joined')}</th>
              <th className="text-right p-4 text-sm font-medium text-[#9ca3af]">{t('activity')}</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onViewDetail={handleViewDetail}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <UserMobileCard
            key={user.id}
            user={user}
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeleteUserDialog
          user={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setDeleteTarget(null);
            setDeleteError(null);
          }}
          loading={deleting}
          error={deleteError}
        />
      )}
    </>
  );
}
