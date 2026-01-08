'use client';

import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import type { ErrorLogLevel } from '@/app/actions/admin';

type FilterOption = 'all' | ErrorLogLevel;

type ErrorLogFilterBarProps = {
  selectedFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  onBulkDeleteClick: () => void;
  labels: {
    all: string;
    error: string;
    warning: string;
    info: string;
    bulkDelete: string;
  };
};

export default function ErrorLogFilterBar({
  selectedFilter,
  onFilterChange,
  onBulkDeleteClick,
  labels
}: ErrorLogFilterBarProps) {
  const filters: { key: FilterOption; label: string }[] = [
    { key: 'all', label: labels.all },
    { key: 'error', label: labels.error },
    { key: 'warning', label: labels.warning },
    { key: 'info', label: labels.info }
  ];

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedFilter === filter.key
                ? 'bg-[#8b5cf6] text-white'
                : 'bg-[rgba(255,255,255,0.05)] text-[#9ca3af] hover:bg-[rgba(255,255,255,0.08)]'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <button
        onClick={onBulkDeleteClick}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(239,68,68,0.2)] text-[#ef4444] hover:bg-[rgba(239,68,68,0.3)] transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        {labels.bulkDelete}
      </button>
    </div>
  );
}
