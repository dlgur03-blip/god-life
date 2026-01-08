'use client';

import ErrorLevelBadge from './ErrorLevelBadge';
import type { ErrorLogItem } from '@/app/actions/admin';

type ErrorLogMobileCardProps = {
  log: ErrorLogItem;
  onClick: () => void;
  dateFormatter: (date: Date) => string;
};

export default function ErrorLogMobileCard({ log, onClick, dateFormatter }: ErrorLogMobileCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] cursor-pointer hover:bg-[rgba(255,255,255,0.08)] transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <ErrorLevelBadge level={log.level} />
        <span className="text-[#6b7280] text-sm">
          {dateFormatter(log.createdAt)}
        </span>
      </div>
      <p className="text-[#e2e8f0] text-sm line-clamp-2 mb-2">
        {log.message}
      </p>
      {log.requestUrl && (
        <p className="text-[#9ca3af] text-xs truncate">
          {log.requestUrl}
        </p>
      )}
    </div>
  );
}
