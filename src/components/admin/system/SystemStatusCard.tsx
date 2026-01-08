import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusBadge from './StatusBadge';

type SystemStatusCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  status?: 'healthy' | 'warning' | 'error';
  statusLabel?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

export default function SystemStatusCard({
  title,
  description,
  icon: Icon,
  status,
  statusLabel,
  action,
  children
}: SystemStatusCardProps) {
  return (
    <div className={cn(
      'p-6 rounded-2xl',
      'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#8b5cf6]/10">
            <Icon className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#e2e8f0]">{title}</h3>
            <p className="text-sm text-[#9ca3af]">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {action}
          {status && statusLabel && (
            <StatusBadge status={status} label={statusLabel} />
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
