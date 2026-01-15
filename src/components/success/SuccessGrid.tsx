'use client';

import { useState } from 'react';
import { updateSuccessEntry } from '@/app/actions/success';
import { cn } from '@/lib/utils';
import { Check, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Entry = {
  id: string;
  dayIndex: number;
  content: string | null;
  isCompleted: boolean;
};

export default function SuccessGrid({
  projectId,
  entries,
  currentDayIndex
}: {
  projectId: string;
  entries: Entry[];
  startDate: string;
  currentDayIndex: number;
}) {
  const t = useTranslations('Success');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getEntry = (idx: number) => entries.find(e => e.dayIndex === idx);

  const handleEntryClick = (idx: number) => {
    // Only today's entry can be clicked
    if (idx !== currentDayIndex) return;

    const entry = getEntry(idx);
    if (entry) {
      setSelectedEntry(entry);
      setContent(entry.content || '');
    }
  };

  const handleSubmit = async () => {
    if (!selectedEntry) return;
    setIsSubmitting(true);
    await updateSuccessEntry(projectId, selectedEntry.dayIndex, content);
    setIsSubmitting(false);
    setSelectedEntry(null);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 10x10 Grid */}
        <div className="grid grid-cols-10 gap-2 md:gap-3 flex-1">
          {Array.from({ length: 100 }, (_, i) => {
            const idx = i + 1;
            const entry = getEntry(idx);
            const isCompleted = entry?.isCompleted;
            const isToday = idx === currentDayIndex;
            const isPast = idx < currentDayIndex;
            const isFuture = idx > currentDayIndex;
            const isDisabled = !isToday; // Only today is interactive

            return (
              <button
                key={idx}
                onClick={() => handleEntryClick(idx)}
                disabled={isDisabled}
                className={cn(
                  "aspect-square rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300 relative group border",
                  isCompleted
                    ? "bg-[var(--color-success)] text-white border-[var(--color-success)] shadow-md"
                    : isToday
                      ? "bg-[var(--color-warning)] text-white animate-pulse shadow-lg border-[var(--color-warning)]"
                      : isPast
                        ? "bg-[var(--color-error)]/20 text-[var(--color-error)] cursor-not-allowed border-[var(--color-error)]/30 opacity-60"
                        : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] cursor-not-allowed border-[var(--color-border)] opacity-50"
                )}
              >
                {idx}
                {isCompleted && <Check className="w-3 h-3 absolute" />}
                {isFuture && <Lock className="w-3 h-3 absolute opacity-30" />}
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className={cn(
          "lg:w-80 bg-[var(--color-card-bg)] backdrop-blur-md border border-[var(--color-border)] rounded-2xl p-6 h-fit sticky top-6 transition-all",
          !selectedEntry ? "opacity-50 pointer-events-none" : "opacity-100"
        )}>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">
            {t('day')} {selectedEntry?.dayIndex || '0'}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-6 uppercase tracking-wider">
            {selectedEntry?.isCompleted ? t('missionComplete') : t('pendingVerification')}
          </p>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('logProgress')}
            className="w-full h-32 bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-sm text-[var(--foreground)] focus:border-[var(--color-secondary)] focus:outline-none resize-none mb-4"
          />

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[var(--color-secondary)] hover:opacity-90 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? t('verifying') : t('confirmEntry')}
          </button>
        </div>
      </div>
    </>
  );
}
