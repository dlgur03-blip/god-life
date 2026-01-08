import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

type StatsChartCardProps = {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
};

export default function StatsChartCard({ title, icon: Icon, iconColor, children }: StatsChartCardProps) {
  return (
    <div className={cn(
      'p-6 rounded-2xl',
      'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
    )}>
      <div className="flex items-center gap-2 mb-4">
        {Icon && (
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${iconColor}15` }}>
            <Icon className="w-4 h-4" style={{ color: iconColor }} />
          </div>
        )}
        <h3 className="text-base font-semibold text-[#e2e8f0]">{title}</h3>
      </div>
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
}
