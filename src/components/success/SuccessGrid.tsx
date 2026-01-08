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

  // Helper to find entry by index
  const getEntry = (idx: number) => entries.find(e => e.dayIndex === idx);

  const handleEntryClick = (idx: number) => {
    // Prevent future access? Plan says "Fail Allowed", but future usually locked.
    // Let's lock future days > currentDayIndex + 1 (allow checking tomorrow maybe? No, strict)
    if (idx > currentDayIndex) return;

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
    setSelectedEntry(null); // Close or keep open? Close for now.
    // Optimistic update could happen here, but revalidatePath handles it.
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* 10x10 Grid */}
      <div className="grid grid-cols-10 gap-2 md:gap-3 flex-1">
        {Array.from({ length: 100 }, (_, i) => {
          const idx = i + 1;
          const entry = getEntry(idx);
          const isCompleted = entry?.isCompleted;
          const isToday = idx === currentDayIndex;
          const isFuture = idx > currentDayIndex;

          return (
            <button
              key={idx}
              onClick={() => handleEntryClick(idx)}
              disabled={isFuture}
              className={cn(
                "aspect-square rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300 relative group",
                isCompleted
                  ? "bg-primary text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  : isToday
                    ? "bg-secondary text-black animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.6)] border-2 border-white"
                    : isFuture
                      ? "bg-white/5 text-gray-700 cursor-not-allowed border border-white/5"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:border-white/30" // Missed/Pending
              )}
            >
              {idx}
              {isCompleted && <Check className="w-3 h-3 absolute" />}
              {isFuture && <Lock className="w-3 h-3 absolute opacity-20" />}
            </button>
          );
        })}
      </div>

      {/* Detail Panel (Sticky on Desktop, Modal-like on Mobile) */}
      <div className={cn(
        "lg:w-80 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-fit sticky top-6 transition-all",
        !selectedEntry ? "opacity-50 pointer-events-none grayscale" : "opacity-100"
      )}>
        <h3 className="text-xl font-bold text-white mb-1">
          {t('day')} {selectedEntry?.dayIndex || '0'}
        </h3>
        <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">
          {selectedEntry?.isCompleted ? t('missionComplete') : t('pendingVerification')}
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('logProgress')}
          className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:border-primary focus:outline-none resize-none mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-cyan-400 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? t('verifying') : t('confirmEntry')}
        </button>
      </div>
    </div>
  );
}
