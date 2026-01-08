import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Users, Compass, Target, Scale, Mail, FileText, TrendingUp } from 'lucide-react';
import { getAdminDashboardStats } from '@/app/actions/admin';
import DashboardStatsCard from '@/components/admin/DashboardStatsCard';
import DashboardModuleCard from '@/components/admin/DashboardModuleCard';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';

async function DashboardContent() {
  const t = await getTranslations('Admin');
  const result = await getAdminDashboardStats();

  if (!result.success) {
    return (
      <div className="text-center py-12 text-[#ef4444]">
        {t('errors.loadFailed')}
      </div>
    );
  }

  const stats = result.data;

  const moduleItems = [
    { key: 'destiny', icon: Compass, color: '#06b6d4', count: stats.moduleStats.destiny },
    { key: 'success', icon: Target, color: '#10b981', count: stats.moduleStats.success },
    { key: 'discipline', icon: Scale, color: '#f59e0b', count: stats.moduleStats.discipline },
    { key: 'epistle', icon: Mail, color: '#ec4899', count: stats.moduleStats.epistle },
    { key: 'bio', icon: FileText, color: '#8b5cf6', count: stats.moduleStats.bio },
  ];

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardStatsCard
          title={t('stats.totalUsers')}
          value={stats.totalUsers}
          icon={Users}
          color="admin"
        />
        <DashboardStatsCard
          title={t('stats.newUsersThisWeek')}
          value={stats.newUsersThisWeek}
          icon={TrendingUp}
          color="primary"
        />
      </div>

      {/* Module Usage */}
      <h2 className="text-lg font-semibold text-[#e2e8f0] mb-4">{t('moduleUsage')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moduleItems.map((item) => (
          <DashboardModuleCard
            key={item.key}
            title={t(`modules.${item.key}.name`)}
            description={t(`modules.${item.key}.desc`)}
            count={item.count}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>
    </>
  );
}

export default async function AdminDashboardPage() {
  const t = await getTranslations('Admin');

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#e2e8f0] mb-6">{t('dashboard.title')}</h1>
      <Suspense fallback={<AdminLoadingSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
