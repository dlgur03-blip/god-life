import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getAdminUserList } from '@/app/actions/admin';
import UserSearchInput from '@/components/admin/users/UserSearchInput';
import UserTable from '@/components/admin/users/UserTable';
import UserLoadingSkeleton from '@/components/admin/users/UserLoadingSkeleton';
import { cn } from '@/lib/utils';

type SearchParams = Promise<{ page?: string; search?: string }>;

async function UsersContent({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations('Admin');
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';

  const result = await getAdminUserList(page, 20, search);

  if (!result.success) {
    return (
      <div className="text-center py-12 text-[#ef4444]">
        {t('errors.loadFailed')}
      </div>
    );
  }

  const { users, total, pageSize } = result.data;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <UserTable users={users} hasSearch={!!search} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}${search ? `&search=${search}` : ''}`}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                p === page
                  ? 'bg-[#8b5cf6] text-white'
                  : 'bg-[rgba(255,255,255,0.05)] text-[#9ca3af] hover:bg-[rgba(255,255,255,0.1)]'
              )}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export default async function AdminUsersPage({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations('Admin');

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#e2e8f0]">{t('users.title')}</h1>
        <div className="w-full sm:w-80">
          <Suspense fallback={<div className="h-11 bg-[rgba(255,255,255,0.1)] rounded-lg animate-pulse" />}>
            <UserSearchInput />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<UserLoadingSkeleton />}>
        <UsersContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
