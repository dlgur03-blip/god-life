'use client';

import { useState, useTransition } from 'react';
import { DatabaseStatus } from '@/app/actions/admin';
import { checkDatabaseConnection } from '@/app/actions/admin';
import { Database, Zap, Server, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import SystemStatusCard from './SystemStatusCard';

type DatabaseStatusCardClientProps = {
  initialStatus: DatabaseStatus;
  labels: {
    title: string;
    description: string;
    status: string;
    connected: string;
    disconnected: string;
    responseTime: string;
    provider: string;
    refresh: string;
    refreshing: string;
  };
};

export default function DatabaseStatusCardClient({
  initialStatus,
  labels
}: DatabaseStatusCardClientProps) {
  const [database, setDatabase] = useState<DatabaseStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      const result = await checkDatabaseConnection();
      if (result.success) {
        setDatabase(result.data);
      }
    });
  };

  return (
    <SystemStatusCard
      title={labels.title}
      description={labels.description}
      icon={Database}
      status={database.connected ? 'healthy' : 'error'}
      statusLabel={database.connected ? labels.connected : labels.disconnected}
      action={
        <button
          onClick={handleRefresh}
          disabled={isPending}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
            'bg-[rgba(139,92,246,0.1)] text-[#8b5cf6]',
            'hover:bg-[rgba(139,92,246,0.2)] transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <RefreshCw className={cn('w-4 h-4', isPending && 'animate-spin')} />
          {isPending ? labels.refreshing : labels.refresh}
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {/* 연결 상태 */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
          <div className={cn(
            'w-3 h-3 rounded-full',
            database.connected ? 'bg-[#10b981]' : 'bg-[#ef4444]'
          )} />
          <div>
            <p className="text-xs text-[#6b7280]">{labels.status}</p>
            <p className={cn(
              'text-sm font-medium',
              database.connected ? 'text-[#10b981]' : 'text-[#ef4444]'
            )}>
              {database.connected ? labels.connected : labels.disconnected}
            </p>
          </div>
        </div>
        {/* 응답 시간 */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
          <Zap className="w-4 h-4 text-[#f59e0b]" />
          <div>
            <p className="text-xs text-[#6b7280]">{labels.responseTime}</p>
            <p className="text-sm font-medium text-[#e2e8f0]">
              {database.responseTimeMs !== null ? `${database.responseTimeMs}ms` : '-'}
            </p>
          </div>
        </div>
        {/* 프로바이더 */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
          <Server className="w-4 h-4 text-[#3b82f6]" />
          <div>
            <p className="text-xs text-[#6b7280]">{labels.provider}</p>
            <p className="text-sm font-medium text-[#e2e8f0]">
              {database.provider}
            </p>
          </div>
        </div>
      </div>
    </SystemStatusCard>
  );
}
