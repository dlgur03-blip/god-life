import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type DashboardModuleCardProps = {
  title: string;
  description: string;
  count: number;
  icon: LucideIcon;
  color: string;
};

export default function DashboardModuleCard({
  title,
  description,
  count,
  icon: Icon,
  color
}: DashboardModuleCardProps) {
  return (
    <div className={cn(
      'p-4 rounded-xl',
      'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]',
      'hover:bg-[rgba(255,255,255,0.05)] transition-colors'
    )}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#e2e8f0]">{title}</p>
          <p className="text-xs text-[#6b7280]">{description}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#e2e8f0]">{count}</p>
        </div>
      </div>
    </div>
  );
}
