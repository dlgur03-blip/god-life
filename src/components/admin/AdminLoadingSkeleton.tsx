import { cn } from '@/lib/utils';

export default function AdminLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Grid Skeleton */}
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
      {/* Module Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={cn(
            'p-4 rounded-xl',
            'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]'
          )}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[rgba(255,255,255,0.1)] rounded-lg" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-[rgba(255,255,255,0.1)] rounded mb-1" />
                <div className="h-3 w-24 bg-[rgba(255,255,255,0.1)] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
