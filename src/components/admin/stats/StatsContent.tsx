'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Users, Activity, Compass, Scale, Target, Mail } from 'lucide-react';
import { getAdminDetailedStats, AdminDetailedStats, StatsPeriod } from '@/app/actions/admin';

import StatsPeriodFilter from './StatsPeriodFilter';
import StatsSummaryCard from './StatsSummaryCard';
import StatsChartCard from './StatsChartCard';
import UserStatsChart from './UserStatsChart';
import ModuleActivityChart from './ModuleActivityChart';
import DisciplineTrendChart from './DisciplineTrendChart';
import StatsEmptyState from './StatsEmptyState';
import StatsErrorState from './StatsErrorState';
import StatsLoadingSkeleton from './StatsLoadingSkeleton';

export default function StatsContent() {
  const t = useTranslations('Admin.stats');
  const [period, setPeriod] = useState<StatsPeriod>('month');
  const [stats, setStats] = useState<AdminDetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getAdminDetailedStats(period);

    if (result.success) {
      setStats(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, [period]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <StatsLoadingSkeleton />;
  }

  if (error) {
    return <StatsErrorState message={t('errors.loadFailed')} onRetry={fetchStats} />;
  }

  if (!stats) {
    return <StatsEmptyState message={t('noData')} />;
  }

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <StatsPeriodFilter selected={period} onChange={setPeriod} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsSummaryCard
          title={t('totalUsers')}
          value={stats.totalUsers}
          icon={Users}
          color="#8b5cf6"
        />
        <StatsSummaryCard
          title={t('activeDaily')}
          value={stats.activeUsersDaily}
          icon={Activity}
          color="#06b6d4"
        />
        <StatsSummaryCard
          title={t('activeWeekly')}
          value={stats.activeUsersWeekly}
          icon={Activity}
          color="#10b981"
        />
        <StatsSummaryCard
          title={t('activeMonthly')}
          value={stats.activeUsersMonthly}
          icon={Activity}
          color="#f59e0b"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Users Trend */}
        <StatsChartCard title={t('charts.userTrend')} icon={Users} iconColor="#8b5cf6">
          {stats.userTrend.length > 0 ? (
            <UserStatsChart data={stats.userTrend} />
          ) : (
            <StatsEmptyState message={t('noData')} />
          )}
        </StatsChartCard>

        {/* Module Activity */}
        <StatsChartCard title={t('charts.moduleActivity')} icon={Compass} iconColor="#06b6d4">
          <ModuleActivityChart
            destinyTrend={stats.moduleStats.destiny.trend}
            epistleTrend={stats.moduleStats.epistle.trend}
            successTrend={stats.moduleStats.success.trend}
          />
        </StatsChartCard>

        {/* Discipline Achievement */}
        <StatsChartCard title={t('charts.disciplineTrend')} icon={Scale} iconColor="#f59e0b">
          {stats.moduleStats.discipline.trend.length > 0 ? (
            <DisciplineTrendChart
              data={stats.moduleStats.discipline.trend}
              averageRate={stats.moduleStats.discipline.averageAchievementRate}
            />
          ) : (
            <StatsEmptyState message={t('noData')} />
          )}
        </StatsChartCard>

        {/* Module Summary Card */}
        <StatsChartCard title={t('charts.moduleSummary')}>
          <div className="grid grid-cols-2 gap-4 h-full content-center">
            <div className="p-4 bg-[rgba(255,255,255,0.03)] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-[#06b6d4]" />
                <span className="text-xs text-[#9ca3af]">{t('modules.destiny')}</span>
              </div>
              <p className="text-2xl font-bold text-[#e2e8f0]">{stats.moduleStats.destiny.totalDays}</p>
              <p className="text-xs text-[#6b7280]">{t('charts.totalDays')}</p>
            </div>
            <div className="p-4 bg-[rgba(255,255,255,0.03)] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-xs text-[#9ca3af]">{t('modules.discipline')}</span>
              </div>
              <p className="text-2xl font-bold text-[#e2e8f0]">{stats.moduleStats.discipline.averageAchievementRate}%</p>
              <p className="text-xs text-[#6b7280]">{t('charts.avgRate')}</p>
            </div>
            <div className="p-4 bg-[rgba(255,255,255,0.03)] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#10b981]" />
                <span className="text-xs text-[#9ca3af]">{t('modules.success')}</span>
              </div>
              <p className="text-2xl font-bold text-[#e2e8f0]">{stats.moduleStats.success.activeProjects}</p>
              <p className="text-xs text-[#6b7280]">{t('charts.activeProjects')}</p>
            </div>
            <div className="p-4 bg-[rgba(255,255,255,0.03)] rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-[#ec4899]" />
                <span className="text-xs text-[#9ca3af]">{t('modules.epistle')}</span>
              </div>
              <p className="text-2xl font-bold text-[#e2e8f0]">{stats.moduleStats.epistle.totalLetters}</p>
              <p className="text-xs text-[#6b7280]">{t('charts.totalLetters')}</p>
            </div>
          </div>
        </StatsChartCard>
      </div>
    </div>
  );
}
