import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  status: 'healthy' | 'warning' | 'error';
  label: string;
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusStyles = {
    healthy: 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30',
    warning: 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30',
    error: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30'
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
      'text-sm font-medium border',
      statusStyles[status]
    )}>
      <span className={cn(
        'w-2 h-2 rounded-full',
        status === 'healthy' && 'bg-[#10b981]',
        status === 'warning' && 'bg-[#f59e0b]',
        status === 'error' && 'bg-[#ef4444]'
      )} />
      {label}
    </span>
  );
}
