export default function TimeblockSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] animate-pulse">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-16 bg-[rgba(255,255,255,0.1)] rounded" />
          <div className="h-4 w-12 bg-[rgba(255,255,255,0.05)] rounded" />
        </div>
        <div className="h-8 w-24 bg-[rgba(255,255,255,0.05)] rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="h-8 w-full bg-[rgba(255,255,255,0.05)] rounded" />
        <div className="h-8 w-3/4 bg-[rgba(255,255,255,0.05)] rounded" />
      </div>
    </div>
  );
}
