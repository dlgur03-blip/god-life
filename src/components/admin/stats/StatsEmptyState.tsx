import { BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatsEmptyStateProps = {
  message: string;
};

export default function StatsEmptyState({ message }: StatsEmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center h-full',
      'text-[#6b7280]'
    )}>
      <BarChart3 className="w-12 h-12 mb-3 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
