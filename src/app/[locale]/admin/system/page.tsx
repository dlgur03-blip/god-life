import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getSystemStatus } from '@/app/actions/admin';
import {
  DatabaseStatusCardClient,
  EnvironmentVariableListEnhanced,
  SystemInfoGrid,
  SystemStatusCard,
  SystemPageSkeleton,
  ErrorLogSection
} from '@/components/admin/system';
import { Settings, Database, Server, Activity } from 'lucide-react';
import DashboardStatsCard from '@/components/admin/DashboardStatsCard';

async function SystemContent() {
  const t = await getTranslations('Admin.system');
  const result = await getSystemStatus();

  if (!result.success) {
    return (
      <div className="p-6 rounded-2xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)]">
        <p className="text-[#ef4444]">Failed to load system status</p>
      </div>
    );
  }

  const { environment, database, systemInfo } = result.data;

  // 상태 요약 계산
  const envConfigured = environment.filter(v => v.value !== null).length;
  const envTotal = environment.length;

  return (
    <div className="space-y-6">
      {/* 상태 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatsCard
          title={t('database.title')}
          value={database.connected ? t('database.connected') : t('database.disconnected')}
          icon={Database}
          color="admin"
        />
        <DashboardStatsCard
          title={t('environment.title')}
          value={`${envConfigured}/${envTotal}`}
          icon={Settings}
          color="primary"
        />
        <DashboardStatsCard
          title={t('info.environment')}
          value={systemInfo.environment}
          icon={Server}
          color="secondary"
        />
        <DashboardStatsCard
          title={t('database.responseTime')}
          value={database.responseTimeMs ? `${database.responseTimeMs}ms` : '-'}
          icon={Activity}
          color="admin"
        />
      </div>

      {/* 데이터베이스 상태 - Client Component with refresh */}
      <DatabaseStatusCardClient
        initialStatus={database}
        labels={{
          title: t('database.title'),
          description: t('database.description'),
          status: t('database.status'),
          connected: t('database.connected'),
          disconnected: t('database.disconnected'),
          responseTime: t('database.responseTime'),
          provider: t('database.provider'),
          refresh: t('database.refresh'),
          refreshing: t('database.refreshing')
        }}
      />

      {/* 환경 변수 */}
      <SystemStatusCard
        title={t('environment.title')}
        description={t('environment.description')}
        icon={Settings}
      >
        <EnvironmentVariableListEnhanced
          variables={environment}
          labels={{
            name: t('environment.name'),
            value: t('environment.value'),
            masked: t('environment.masked'),
            notSet: t('environment.notSet'),
            requiredMissing: t('environment.requiredMissing')
          }}
        />
      </SystemStatusCard>

      {/* 시스템 정보 */}
      <SystemStatusCard
        title={t('info.title')}
        description={t('info.description')}
        icon={Server}
      >
        <SystemInfoGrid
          info={systemInfo}
          labels={{
            nodeVersion: t('info.nodeVersion'),
            nextVersion: t('info.nextVersion'),
            reactVersion: t('info.reactVersion'),
            prismaVersion: t('info.prismaVersion'),
            platform: t('info.platform'),
            timezone: t('info.timezone'),
            locale: t('info.locale'),
            environment: t('info.environment')
          }}
        />
      </SystemStatusCard>

      {/* 에러 로그 */}
      <ErrorLogSection />
    </div>
  );
}

export default async function SystemPage() {
  const t = await getTranslations('Admin.system');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#e2e8f0]">{t('title')}</h1>
      <Suspense fallback={<SystemPageSkeleton />}>
        <SystemContent />
      </Suspense>
    </div>
  );
}
