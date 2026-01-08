import { cn } from '@/lib/utils';

export default function StatsLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Period Filter Skeleton */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-9 w-20 bg-[rgba(255,255,255,0.1)] rounded-lg" />
        ))}
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={cn(
            'p-6 rounded-2xl',
            'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
          )}>
            <div className="h-4 w-24 bg-[rgba(255,255,255,0.1)] rounded mb-2" />
            <div className="h-8 w-16 bg-[rgba(255,255,255,0.1)] rounded" />
          </div>
        ))}
      </div>

      {/* Chart Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={cn(
            'p-6 rounded-2xl',
            'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
          )}>
            <div className="h-5 w-32 bg-[rgba(255,255,255,0.1)] rounded mb-4" />
            <div className="h-64 bg-[rgba(255,255,255,0.05)] rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
