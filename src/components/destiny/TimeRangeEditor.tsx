'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import TimePicker from './TimePicker';
import { updateTimeblockTime } from '@/app/actions/destiny';
import { Check, X, AlertCircle } from 'lucide-react';

type TimeRangeEditorProps = {
  blockId: string;
  startTime: string;
  endTime: string;
  onCancel: () => void;
  onSave: () => void;
};

export default function TimeRangeEditor({
  blockId,
  startTime: initialStart,
  endTime: initialEnd,
  onCancel,
  onSave,
}: TimeRangeEditorProps) {
  const t = useTranslations('Destiny.timeblock');
  const tCommon = useTranslations('Common');

  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(initialEnd);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError(null);

    // Client-side validation
    if (endTime !== '24:00' && startTime >= endTime) {
      setError(t('endMustBeAfterStart'));
      return;
    }

    setSaving(true);
    try {
      await updateTimeblockTime(blockId, startTime, endTime);
      onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : tCommon('errors.unknown'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[#06b6d4]">
      <TimePicker value={startTime} onChange={setStartTime} />
      <span className="text-[#6b7280]">→</span>
      <TimePicker value={endTime} onChange={setEndTime} />

      <div className="flex gap-1 ml-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="p-1.5 rounded-md bg-[rgba(34,197,94,0.2)] hover:bg-[rgba(34,197,94,0.4)] text-[#22c55e] transition-colors disabled:opacity-50"
        >
          <Check size={16} />
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="p-1.5 rounded-md bg-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.4)] text-[#ef4444] transition-colors disabled:opacity-50"
        >
          <X size={16} />
        </button>
      </div>

      {error && (
        <div className="w-full flex items-center gap-1 text-xs text-[#ef4444] mt-1">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
}
