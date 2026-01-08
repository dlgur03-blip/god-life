'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ErrorLogPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  labels: {
    prev: string;
    next: string;
    page: string;
  };
};

export default function ErrorLogPagination({
  currentPage,
  totalPages,
  onPageChange,
  labels
}: ErrorLogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          'bg-[rgba(255,255,255,0.05)]',
          currentPage === 1
            ? 'text-[#6b7280] cursor-not-allowed'
            : 'text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.08)]'
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        {labels.prev}
      </button>
      <span className="text-[#9ca3af] text-sm">
        {labels.page.replace('{current}', String(currentPage)).replace('{total}', String(totalPages))}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          'bg-[rgba(255,255,255,0.05)]',
          currentPage === totalPages
            ? 'text-[#6b7280] cursor-not-allowed'
            : 'text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.08)]'
        )}
      >
        {labels.next}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
