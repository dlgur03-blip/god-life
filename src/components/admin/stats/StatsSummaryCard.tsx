import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatsSummaryCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;  // hex color
};

export default function StatsSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: StatsSummaryCardProps) {
  return (
    <div className={cn(
      'p-6 rounded-2xl',
      'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]',
      'hover:bg-[rgba(255,255,255,0.08)] transition-colors'
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#9ca3af] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#e2e8f0]">{value}</p>
          {subtitle && (
            <p className="text-xs text-[#6b7280] mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}
