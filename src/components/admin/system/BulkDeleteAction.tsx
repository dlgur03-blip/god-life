'use client';

import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { deleteErrorLogsBefore } from '@/app/actions/admin';

type BulkDeleteActionProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (count: number) => void;
  labels: {
    title: string;
    description: string;
    options: {
      '7days': string;
      '30days': string;
      '90days': string;
    };
    confirmMessage: string;
    success: string;
    deleting: string;
    cancel: string;
    confirm: string;
  };
};

export default function BulkDeleteAction({
  isOpen,
  onClose,
  onDeleted,
  labels
}: BulkDeleteActionProps) {
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const options = [
    { days: 7, label: labels.options['7days'] },
    { days: 30, label: labels.options['30days'] },
    { days: 90, label: labels.options['90days'] }
  ];

  const handleSelect = (days: number) => {
    setSelectedDays(days);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDays === null) return;

    setIsDeleting(true);
    const date = new Date();
    date.setDate(date.getDate() - selectedDays);

    const result = await deleteErrorLogsBefore(date);
    if (result.success) {
      onDeleted(result.data.deletedCount);
      onClose();
    }
    setIsDeleting(false);
  };

  const handleClose = () => {
    setSelectedDays(null);
    setShowConfirm(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-[#050b14] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <h2 className="text-lg font-semibold text-[#e2e8f0]">{labels.title}</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            <X className="w-5 h-5 text-[#9ca3af]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!showConfirm ? (
            <>
              <p className="text-[#9ca3af] text-sm mb-4">{labels.description}</p>
              <div className="space-y-2">
                {options.map((option) => (
                  <button
                    key={option.days}
                    onClick={() => handleSelect(option.days)}
                    className="w-full p-3 rounded-xl bg-[rgba(255,255,255,0.05)] text-[#e2e8f0] text-left hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] mb-4">
                <p className="text-[#ef4444] text-sm">
                  {labels.confirmMessage.replace('{count}', '?')}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedDays(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-[#9ca3af] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                >
                  {labels.cancel}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[rgba(239,68,68,0.2)] text-[#ef4444] hover:bg-[rgba(239,68,68,0.3)] transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? labels.deleting : labels.confirm}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
