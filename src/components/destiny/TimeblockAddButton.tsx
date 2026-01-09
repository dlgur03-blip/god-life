'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, X, MapPin, FileText, Clock } from 'lucide-react';
import { createTimeblockWithData } from '@/app/actions/destiny';
import { cn } from '@/lib/utils';

type TimeblockAddButtonProps = {
  dayId: string;
  afterSeq?: number;
  variant?: 'inline' | 'floating';
  lastEndTime?: string; // 마지막 블록의 종료 시간
};

// Generate time options (00:00 to 24:00 in 5-min increments)
const generateTimeOptions = () => {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
      options.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  options.push('24:00');
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

export default function TimeblockAddButton({ dayId, variant = 'inline', lastEndTime }: TimeblockAddButtonProps) {
  const t = useTranslations('Destiny.timeblock');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const defaultStart = lastEndTime || '09:00';
  const defaultEnd = lastEndTime
    ? `${String(Math.min(parseInt(lastEndTime.split(':')[0]) + 1, 24)).padStart(2, '0')}:00`
    : '10:00';

  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime, setEndTime] = useState(defaultEnd);
  const [planLocation, setPlanLocation] = useState('');
  const [planText, setPlanText] = useState('');

  const handleOpen = () => {
    // Reset to defaults
    const start = lastEndTime || '09:00';
    const end = lastEndTime
      ? `${String(Math.min(parseInt(lastEndTime.split(':')[0]) + 1, 24)).padStart(2, '0')}:00`
      : '10:00';
    setStartTime(start);
    setEndTime(end);
    setPlanLocation('');
    setPlanText('');
    setError(null);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (endTime !== '24:00' && startTime >= endTime) {
      setError(t('endMustBeAfterStart'));
      return;
    }

    setLoading(true);
    try {
      await createTimeblockWithData(dayId, {
        startTime,
        endTime,
        planLocation: planLocation || undefined,
        planText: planText || undefined,
      });
      setIsOpen(false);
    } catch (e) {
      console.error('Failed to create timeblock:', e);
      setError(e instanceof Error ? e.message : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  // Modal
  const renderModal = () => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Dialog */}
        <div className="relative z-10 w-full max-w-md bg-[var(--background)]/95 border border-[var(--color-border)] rounded-2xl p-5 shadow-lg backdrop-blur-xl animate-in fade-in zoom-in-95">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[var(--foreground)]">{t('addBlock')}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Time Selection */}
            <div className="flex gap-3 items-center">
              <Clock className="w-5 h-5 text-[var(--foreground-muted)] shrink-0" />
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="flex-1 bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--foreground)] focus:border-[var(--color-primary)] focus:outline-none"
              >
                {TIME_OPTIONS.filter(t => t !== '24:00').map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <span className="text-[var(--foreground-muted)]">~</span>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="flex-1 bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--foreground)] focus:border-[var(--color-primary)] focus:outline-none"
              >
                {TIME_OPTIONS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="flex gap-3 items-center">
              <MapPin className="w-5 h-5 text-[var(--foreground-muted)] shrink-0" />
              <input
                type="text"
                value={planLocation}
                onChange={(e) => setPlanLocation(e.target.value)}
                placeholder={t('locationPlaceholder')}
                className="flex-1 bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--foreground)] focus:border-[var(--color-primary)] focus:outline-none placeholder:text-[var(--foreground-muted)]"
              />
            </div>

            {/* Plan Text */}
            <div className="flex gap-3 items-start">
              <FileText className="w-5 h-5 text-[var(--foreground-muted)] shrink-0 mt-2" />
              <textarea
                value={planText}
                onChange={(e) => setPlanText(e.target.value)}
                placeholder={t('planPlaceholder')}
                rows={3}
                className="flex-1 bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--foreground)] focus:border-[var(--color-primary)] focus:outline-none placeholder:text-[var(--foreground-muted)] resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 text-[var(--color-primary)] border border-[var(--color-primary)]/50 font-bold transition-all disabled:opacity-50"
            >
              {loading ? t('adding') : t('addBlock')}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={handleOpen}
          className={cn(
            "fixed bottom-6 right-6 p-4 rounded-full z-40",
            "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-lg",
            "transition-all hover:scale-110"
          )}
        >
          <Plus size={24} className="text-white" />
        </button>
        {renderModal()}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className={cn(
          "w-full py-3 rounded-xl border-2 border-dashed border-[var(--color-border)]",
          "hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10",
          "flex items-center justify-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--color-primary)]",
          "transition-all"
        )}
      >
        <Plus size={20} />
        <span className="text-sm">{t('addBlock')}</span>
      </button>
      {renderModal()}
    </>
  );
}
