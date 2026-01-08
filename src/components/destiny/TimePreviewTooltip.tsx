'use client';

import { cn } from '@/lib/utils';

type TimePreviewTooltipProps = {
  time: string;
  edge: 'top' | 'bottom';
  isValid: boolean;
  visible: boolean;
};

export default function TimePreviewTooltip({
  time,
  edge,
  isValid,
  visible,
}: TimePreviewTooltipProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'absolute left-1/2 -translate-x-1/2 z-20',
        'px-2 py-1 rounded-md text-xs font-mono font-bold',
        'pointer-events-none transition-all duration-100',
        'shadow-lg',
        edge === 'top' ? '-top-8' : '-bottom-8',
        isValid
          ? 'bg-[rgba(6,182,212,0.9)] text-white'
          : 'bg-[rgba(239,68,68,0.9)] text-white'
      )}
    >
      {time}
    </div>
  );
}
