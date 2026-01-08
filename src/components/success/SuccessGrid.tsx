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
                  "aspect-square rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300 relative group",
                  isCompleted
                    ? "bg-[#06b6d4] text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : isToday
                      ? "bg-[#f59e0b] text-black animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.6)] border-2 border-white"
                      : isFuture
                        ? "bg-white/5 text-[#4b5563] cursor-not-allowed border border-white/5"
                        : "bg-white/5 text-[#9ca3af] hover:bg-white/10 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)]"
                )}
              >
                {idx}
                {isCompleted && <Check className="w-3 h-3 absolute" />}
                {isFuture && <Lock className="w-3 h-3 absolute opacity-20" />}
                {/* Image indicator for completed entries with photos */}
                {isCompleted && hasImage && (
                  <ImageIcon className="w-2.5 h-2.5 absolute bottom-0.5 right-0.5 text-black/60" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className={cn(
          "lg:w-80 bg-black/40 backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-2xl p-6 h-fit sticky top-6 transition-all",
          !selectedEntry ? "opacity-50 pointer-events-none grayscale" : "opacity-100"
        )}>
          <h3 className="text-xl font-bold text-white mb-1">
            {t('day')} {selectedEntry?.dayIndex || '0'}
          </h3>
          <p className="text-xs text-[#6b7280] mb-6 uppercase tracking-wider">
            {selectedEntry?.isCompleted ? t('missionComplete') : t('pendingVerification')}
          </p>

          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="block text-xs text-[#9ca3af] mb-2 uppercase tracking-wider">
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
            className="w-full h-32 bg-white/5 border border-[rgba(255,255,255,0.1)] rounded-lg p-3 text-sm text-[#e2e8f0] focus:border-[#06b6d4] focus:outline-none resize-none mb-4"
          />

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#06b6d4] hover:bg-[#0891b2] text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
