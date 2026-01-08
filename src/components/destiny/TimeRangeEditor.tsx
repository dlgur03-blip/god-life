'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import TimePicker from './TimePicker';
import { updateTimeblockTime } from '@/app/actions/destiny';
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';

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
    if (!startTime || !endTime) {
      setError(t('timeRequired', { defaultValue: 'Time values are required.' }));
      return;
    }

    if (endTime !== '24:00' && startTime >= endTime) {
      setError(t('endMustBeAfterStart'));
      return;
    }

    setSaving(true);
    try {
      const result = await updateTimeblockTime(blockId, startTime, endTime);

      if ('success' in result) {
        if (result.success) {
          onSave();
        } else {
          // Handle error response from server
          const errorKey = result.error || 'unknown';
          // Try to get translated error message
          const translatedError = tCommon(`errors.${errorKey.toLowerCase()}`, {
            defaultValue: result.error
          });
          setError(translatedError);
        }
      } else {
        // Legacy: result is void (operation succeeded)
        onSave();
      }
    } catch (e) {
      console.error('[TimeRangeEditor] Save error:', e);
      setError(e instanceof Error ? e.message : tCommon('errors.unknown'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[#06b6d4]">
      <TimePicker value={startTime} onChange={setStartTime} disabled={saving} />
      <span className="text-[#6b7280]">→</span>
      <TimePicker value={endTime} onChange={setEndTime} disabled={saving} />

      <div className="flex gap-1 ml-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="p-1.5 rounded-md bg-[rgba(34,197,94,0.2)] hover:bg-[rgba(34,197,94,0.4)] text-[#22c55e] transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
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
        <div className="w-full flex items-center gap-1 text-xs text-[#ef4444] mt-1 p-2 rounded bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)]">
          <AlertCircle size={12} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
