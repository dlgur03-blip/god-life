'use client';

import { useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import ErrorLevelBadge from './ErrorLevelBadge';
import { deleteErrorLog } from '@/app/actions/admin';
import type { ErrorLogItem } from '@/app/actions/admin';

type ErrorLogDetailModalProps = {
  log: ErrorLogItem;
  onClose: () => void;
  onDeleted: () => void;
  dateFormatter: (date: Date) => string;
  labels: {
    title: string;
    stackTrace: string;
    noStack: string;
    deleteLog: string;
    deleting: string;
    user: string;
    requestUrl: string;
    requestMethod: string;
    createdAt: string;
  };
};

export default function ErrorLogDetailModal({
  log,
  onClose,
  onDeleted,
  dateFormatter,
  labels
}: ErrorLogDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteErrorLog(log.id);
    if (result.success) {
      onDeleted();
    }
    setIsDeleting(false);
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#050b14] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <h2 className="text-lg font-semibold text-[#e2e8f0]">{labels.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            <X className="w-5 h-5 text-[#9ca3af]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Level & Message */}
          <div className="mb-6">
            <div className="mb-3">
              <ErrorLevelBadge level={log.level} />
            </div>
            <p className="text-[#e2e8f0] text-base">{log.message}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-[#6b7280] mb-1">{labels.user}</p>
              <p className="text-[#9ca3af]">{log.userName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-[#6b7280] mb-1">{labels.createdAt}</p>
              <p className="text-[#9ca3af]">{dateFormatter(log.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-[#6b7280] mb-1">{labels.requestMethod}</p>
              <p className="text-[#9ca3af]">{log.requestMethod || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-[#6b7280] mb-1">{labels.requestUrl}</p>
              <p className="text-[#9ca3af] truncate">{log.requestUrl || '-'}</p>
            </div>
          </div>

          {/* Stack Trace */}
          <div>
            <p className="text-sm text-[#6b7280] mb-2">{labels.stackTrace}</p>
            {log.stack ? (
              <pre className="p-4 rounded-xl bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.05)] text-sm text-[#9ca3af] font-mono overflow-x-auto whitespace-pre-wrap">
                {log.stack}
              </pre>
            ) : (
              <p className="text-[#6b7280] italic">{labels.noStack}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-[rgba(255,255,255,0.1)]">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(239,68,68,0.2)] text-[#ef4444] hover:bg-[rgba(239,68,68,0.3)] transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? labels.deleting : labels.deleteLog}
          </button>
        </div>
      </div>
    </div>
  );
}
