import { cn } from '@/lib/utils';

export default function SystemPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 상태 요약 카드 스켈레톤 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'p-6 rounded-2xl',
              'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-[rgba(255,255,255,0.1)] rounded" />
                <div className="h-8 w-16 bg-[rgba(255,255,255,0.1)] rounded" />
              </div>
              <div className="h-12 w-12 bg-[rgba(255,255,255,0.1)] rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* 데이터베이스 카드 스켈레톤 */}
      <div className={cn(
        'p-6 rounded-2xl',
        'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
      )}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-11 w-11 bg-[rgba(255,255,255,0.1)] rounded-xl" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-[rgba(255,255,255,0.1)] rounded" />
            <div className="h-4 w-48 bg-[rgba(255,255,255,0.1)] rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-[rgba(255,255,255,0.05)] rounded-lg" />
          ))}
        </div>
      </div>

      {/* 환경 변수 카드 스켈레톤 */}
      <div className={cn(
        'p-6 rounded-2xl',
        'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
      )}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-11 w-11 bg-[rgba(255,255,255,0.1)] rounded-xl" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-[rgba(255,255,255,0.1)] rounded" />
            <div className="h-4 w-48 bg-[rgba(255,255,255,0.1)] rounded" />
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-[rgba(255,255,255,0.05)] rounded-lg" />
          ))}
        </div>
      </div>

      {/* 시스템 정보 스켈레톤 */}
      <div className={cn(
        'p-6 rounded-2xl',
        'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]'
      )}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-11 w-11 bg-[rgba(255,255,255,0.1)] rounded-xl" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-[rgba(255,255,255,0.1)] rounded" />
            <div className="h-4 w-48 bg-[rgba(255,255,255,0.1)] rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-[rgba(255,255,255,0.05)] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
