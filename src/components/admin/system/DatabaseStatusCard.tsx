import { DatabaseStatus } from '@/app/actions/admin';
import { Database, Zap, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import SystemStatusCard from './SystemStatusCard';

type DatabaseStatusCardProps = {
  database: DatabaseStatus;
  labels: {
    title: string;
    description: string;
    status: string;
    connected: string;
    disconnected: string;
    responseTime: string;
    provider: string;
  };
};

export default function DatabaseStatusCard({
  database,
  labels
}: DatabaseStatusCardProps) {
  return (
    <SystemStatusCard
      title={labels.title}
      description={labels.description}
      icon={Database}
      status={database.connected ? 'healthy' : 'error'}
      statusLabel={database.connected ? labels.connected : labels.disconnected}
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
