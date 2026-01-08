'use client';

export default function BioAdminLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-48 bg-[rgba(255,255,255,0.1)] rounded" />
        <div className="h-10 w-32 bg-[rgba(255,255,255,0.1)] rounded-lg" />
      </div>
      <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-[rgba(255,255,255,0.1)]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-[rgba(255,255,255,0.1)] rounded" />
          ))}
        </div>
        {[...Array(5)].map((_, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-5 gap-4 p-4 border-b border-[rgba(255,255,255,0.05)]">
            {[...Array(5)].map((_, colIdx) => (
              <div key={colIdx} className="h-4 bg-[rgba(255,255,255,0.05)] rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
