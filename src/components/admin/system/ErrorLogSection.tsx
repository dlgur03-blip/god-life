'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import SystemStatusCard from './SystemStatusCard';
import ErrorLogSummaryStats from './ErrorLogSummaryStats';
import ErrorLogFilterBar from './ErrorLogFilterBar';
import ErrorLogTableRow from './ErrorLogTableRow';
import ErrorLogMobileCard from './ErrorLogMobileCard';
import ErrorLogPagination from './ErrorLogPagination';
import ErrorLogDetailModal from './ErrorLogDetailModal';
import ErrorLogEmptyState from './ErrorLogEmptyState';
import BulkDeleteAction from './BulkDeleteAction';
import { getErrorLogs, getErrorLogSummary } from '@/app/actions/admin';
import type { ErrorLogItem, ErrorLogLevel, ErrorLogSummary } from '@/app/actions/admin';

type FilterOption = 'all' | ErrorLogLevel;

export default function ErrorLogSection() {
  const t = useTranslations('Admin.system.errorLog');
  const tCommon = useTranslations('Common');

  const [logs, setLogs] = useState<ErrorLogItem[]>([]);
  const [summary, setSummary] = useState<ErrorLogSummary | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [selectedLog, setSelectedLog] = useState<ErrorLogItem | null>(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 20;

  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleString();
  }, []);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    const level = filter === 'all' ? undefined : filter;
    const result = await getErrorLogs(page, pageSize, level);
    if (result.success) {
      setLogs(result.data.logs);
      setTotalPages(Math.ceil(result.data.total / pageSize));
    }
    setIsLoading(false);
  }, [page, filter]);

  const fetchSummary = useCallback(async () => {
    const result = await getErrorLogSummary();
    if (result.success) {
      setSummary(result.data);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
    fetchSummary();
  }, [fetchLogs, fetchSummary]);

  const handleFilterChange = (newFilter: FilterOption) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleLogDeleted = () => {
    setSelectedLog(null);
    fetchLogs();
    fetchSummary();
  };

  const handleBulkDeleted = () => {
    setPage(1);
    fetchLogs();
    fetchSummary();
  };

  return (
    <SystemStatusCard
      title={t('title')}
      description={t('description')}
      icon={AlertTriangle}
    >
      {/* Summary Stats */}
      {summary && (
        <ErrorLogSummaryStats
          summary={summary}
          labels={{
            totalErrors: t('summary.totalErrors'),
            totalWarnings: t('summary.totalWarnings'),
            totalInfo: t('summary.totalInfo'),
            recent24h: t('summary.recent24h')
          }}
        />
      )}

      {/* Filter Bar */}
      <ErrorLogFilterBar
        selectedFilter={filter}
        onFilterChange={handleFilterChange}
        onBulkDeleteClick={() => setShowBulkDelete(true)}
        labels={{
          all: t('levels.all'),
          error: t('levels.error'),
          warning: t('levels.warning'),
          info: t('levels.info'),
          bulkDelete: t('bulkDelete.button')
        }}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <p className="text-[#9ca3af]">{tCommon('loading')}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && logs.length === 0 && (
        <ErrorLogEmptyState
          labels={{
            noLogs: t('noLogs'),
            systemHealthy: t('systemHealthy')
          }}
        />
      )}

      {/* Desktop Table */}
      {!isLoading && logs.length > 0 && (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.1)]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6b7280]">
                    {t('table.level')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6b7280]">
                    {t('table.message')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6b7280]">
                    {t('table.requestUrl')}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#6b7280]">
                    {t('table.createdAt')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <ErrorLogTableRow
                    key={log.id}
                    log={log}
                    onClick={() => setSelectedLog(log)}
                    dateFormatter={formatDate}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {logs.map((log) => (
              <ErrorLogMobileCard
                key={log.id}
                log={log}
                onClick={() => setSelectedLog(log)}
                dateFormatter={formatDate}
              />
            ))}
          </div>

          {/* Pagination */}
          <ErrorLogPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            labels={{
              prev: t('pagination.prev'),
              next: t('pagination.next'),
              page: t('pagination.page')
            }}
          />
        </>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <ErrorLogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          onDeleted={handleLogDeleted}
          dateFormatter={formatDate}
          labels={{
            title: t('detail.title'),
            stackTrace: t('detail.stackTrace'),
            noStack: t('detail.noStack'),
            deleteLog: t('detail.deleteLog'),
            deleting: tCommon('status.deleting'),
            user: t('table.user'),
            requestUrl: t('table.requestUrl'),
            requestMethod: t('table.requestMethod'),
            createdAt: t('table.createdAt')
          }}
        />
      )}

      {/* Bulk Delete Dialog */}
      <BulkDeleteAction
        isOpen={showBulkDelete}
        onClose={() => setShowBulkDelete(false)}
        onDeleted={handleBulkDeleted}
        labels={{
          title: t('bulkDelete.title'),
          description: t('bulkDelete.description'),
          options: {
            '7days': t('bulkDelete.options.7days'),
            '30days': t('bulkDelete.options.30days'),
            '90days': t('bulkDelete.options.90days')
          },
          confirmMessage: t('bulkDelete.confirmMessage'),
          success: t('bulkDelete.success'),
          deleting: t('bulkDelete.deleting'),
          cancel: tCommon('cancel'),
          confirm: tCommon('confirm')
        }}
      />
    </SystemStatusCard>
  );
}
