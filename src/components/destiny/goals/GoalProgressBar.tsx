'use client';

import { cn } from '@/lib/utils';

interface GoalProgressBarProps {
  progress: number;
  color: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function GoalProgressBar({
  progress,
  color,
  showLabel = true,
  size = 'md',
}: GoalProgressBarProps) {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className={cn(
          'flex-1 bg-white/10 rounded-full overflow-hidden',
          heights[size]
        )}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 w-10 text-right">
          {progress}%
        </span>
      )}
    </div>
  );
}
