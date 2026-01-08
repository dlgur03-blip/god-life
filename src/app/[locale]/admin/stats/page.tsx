import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import StatsContent from '@/components/admin/stats/StatsContent';
import StatsLoadingSkeleton from '@/components/admin/stats/StatsLoadingSkeleton';

export default async function AdminStatsPage() {
  const t = await getTranslations('Admin.stats');

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#e2e8f0] mb-6">{t('title')}</h1>
      <Suspense fallback={<StatsLoadingSkeleton />}>
        <StatsContent />
      </Suspense>
    </div>
  );
}
