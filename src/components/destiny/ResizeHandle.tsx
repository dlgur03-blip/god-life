'use client';

import { cn } from '@/lib/utils';
import type { ResizeEdge } from '@/types/resize';

type ResizeHandleProps = {
  edge: ResizeEdge;
  isActive?: boolean;
  isHovered?: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
};

export default function ResizeHandle({
  edge,
  isActive,
  isHovered,
  onPointerDown,
}: ResizeHandleProps) {
  return (
    <div
      className={cn(
        'absolute left-0 right-0 h-3 cursor-ns-resize z-10',
        'flex items-center justify-center',
        'transition-all duration-150',
        edge === 'top' ? '-top-1.5' : '-bottom-1.5',
        // Touch-friendly hit area
        'touch-none'
      )}
      onPointerDown={onPointerDown}
    >
      {/* Visual indicator bar */}
      <div
        className={cn(
          'w-12 h-1 rounded-full transition-all duration-150',
          isActive
            ? 'bg-[#06b6d4] scale-x-125'
            : isHovered
            ? 'bg-[rgba(6,182,212,0.6)]'
            : 'bg-[rgba(6,182,212,0.3)] opacity-0 group-hover:opacity-100'
        )}
      />
    </div>
  );
}
