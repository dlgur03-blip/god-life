'use client';

import ErrorLevelBadge from './ErrorLevelBadge';
import type { ErrorLogItem } from '@/app/actions/admin';

type ErrorLogTableRowProps = {
  log: ErrorLogItem;
  onClick: () => void;
  dateFormatter: (date: Date) => string;
};

export default function ErrorLogTableRow({ log, onClick, dateFormatter }: ErrorLogTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className="hover:bg-[rgba(255,255,255,0.08)] cursor-pointer transition-colors"
    >
      <td className="px-4 py-3">
        <ErrorLevelBadge level={log.level} />
      </td>
      <td className="px-4 py-3">
        <span className="text-[#e2e8f0] truncate block max-w-[300px]">
          {log.message}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[#9ca3af] text-sm truncate block max-w-[200px]">
          {log.requestUrl || '-'}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[#6b7280] text-sm">
          {dateFormatter(log.createdAt)}
        </span>
      </td>
    </tr>
  );
}
