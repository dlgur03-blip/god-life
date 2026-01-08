import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type DashboardStatsCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  color?: 'primary' | 'secondary' | 'admin';
};

export default function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary'
}: DashboardStatsCardProps) {
  const colorStyles = {
    primary: { icon: 'text-[#06b6d4]', bg: 'bg-[#06b6d4]/10' },
    secondary: { icon: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
    admin: { icon: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/10' }
  };

  const styles = colorStyles[color];

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
          {trend && (
            <p className={cn(
              'text-sm mt-2',
              trend.isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', styles.bg)}>
          <Icon className={cn('w-6 h-6', styles.icon)} />
        </div>
      </div>
    </div>
  );
}
