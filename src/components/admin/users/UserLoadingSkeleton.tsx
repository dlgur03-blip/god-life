'use client';

export default function UserLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Search bar skeleton */}
      <div className="h-11 w-full max-w-md bg-[rgba(255,255,255,0.1)] rounded-lg mb-6" />

      {/* Table skeleton */}
      <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-[rgba(255,255,255,0.1)]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-[rgba(255,255,255,0.1)] rounded" />
          ))}
        </div>
        {/* Rows */}
        {[...Array(5)].map((_, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-4 gap-4 p-4 border-b border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)]" />
              <div className="h-4 w-32 bg-[rgba(255,255,255,0.05)] rounded" />
            </div>
            {[...Array(3)].map((_, colIdx) => (
              <div key={colIdx} className="h-4 bg-[rgba(255,255,255,0.05)] rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
