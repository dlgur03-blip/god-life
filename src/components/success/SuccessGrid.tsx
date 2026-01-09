'use client';

import { useState } from 'react';
import { updateSuccessEntry } from '@/app/actions/success';
import { cn } from '@/lib/utils';
import { Check, Lock, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ImageUpload from './ImageUpload';
import ImagePreviewModal from './ImagePreviewModal';

// Updated Entry type with imageUrl
type Entry = {
  id: string;
  dayIndex: number;
  content: string | null;
  imageUrl: string | null;
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image preview modal state
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; imageUrl: string; dayIndex: number }>(
    { isOpen: false, imageUrl: '', dayIndex: 0 }
  );

  const getEntry = (idx: number) => entries.find(e => e.dayIndex === idx);

  const handleEntryClick = (idx: number) => {
    if (idx > currentDayIndex) return;

    const entry = getEntry(idx);
    if (entry) {
      // If clicking on completed entry with image, show preview modal
      if (entry.isCompleted && entry.imageUrl) {
        setPreviewModal({ isOpen: true, imageUrl: entry.imageUrl, dayIndex: entry.dayIndex });
        return;
      }

      setSelectedEntry(entry);
      setContent(entry.content || '');
      setImageUrl(entry.imageUrl || null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEntry) return;
    setIsSubmitting(true);
    await updateSuccessEntry(projectId, selectedEntry.dayIndex, content, imageUrl);
    setIsSubmitting(false);
    setSelectedEntry(null);
    setImageUrl(null);
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
            const hasImage = entry?.imageUrl;
            const isToday = idx === currentDayIndex;
            const isFuture = idx > currentDayIndex;

            return (
              <button
                key={idx}
                onClick={() => handleEntryClick(idx)}
                disabled={isFuture}
                className={cn(
                  "aspect-square rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300 relative group border",
                  isCompleted
                    ? "bg-[var(--color-success)] text-white border-[var(--color-success)] shadow-md"
                    : isToday
                      ? "bg-[var(--color-warning)] text-white animate-pulse shadow-lg border-[var(--color-warning)]"
                      : isFuture
                        ? "bg-[var(--background-secondary)] text-[var(--foreground-muted)] cursor-not-allowed border-[var(--color-border)] opacity-50"
                        : "bg-[var(--color-card-bg)] text-[var(--foreground)] hover:bg-[var(--color-card-hover)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
                )}
              >
                {idx}
                {isCompleted && <Check className="w-3 h-3 absolute" />}
                {isFuture && <Lock className="w-3 h-3 absolute opacity-30" />}
                {/* Image indicator for completed entries with photos */}
                {isCompleted && hasImage && (
                  <ImageIcon className="w-2.5 h-2.5 absolute bottom-0.5 right-0.5 text-white/60" />
                )}
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

          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="block text-xs text-[var(--foreground-muted)] mb-2 uppercase tracking-wider">
              {t('image.notePhoto')}
            </label>
            <ImageUpload
              projectId={projectId}
              dayIndex={selectedEntry?.dayIndex || 0}
              currentImageUrl={selectedEntry?.imageUrl}
              onUploadComplete={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl(null)}
              disabled={!selectedEntry}
            />
          </div>

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

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={previewModal.isOpen}
        imageUrl={previewModal.imageUrl}
        dayIndex={previewModal.dayIndex}
        onClose={() => setPreviewModal({ isOpen: false, imageUrl: '', dayIndex: 0 })}
      />
    </>
  );
}
