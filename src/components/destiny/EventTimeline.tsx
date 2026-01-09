'use client';

import { useState } from 'react';
import { createDestinyEvent } from '@/app/actions/destiny';
import { Plus, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { formatTimeDisplay } from '@/lib/date';

type Event = {
  id: string;
  title: string;
  recordedAt: Date | string; // Accept both Date and ISO string
};

export default function EventTimeline({ dayId, events }: { dayId: string, events: Event[] }) {
  const t = useTranslations('Destiny');
  const locale = useLocale() as 'en' | 'ko' | 'ja';
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await createDestinyEvent(dayId, newTitle);
    setNewTitle('');
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <section className="mt-8 mb-24 relative">
      <h2 className="text-sm font-bold text-[var(--foreground-muted)] uppercase tracking-wider mb-6 px-2">{t('flowOfEvents')}</h2>

      {/* Timeline */}
      <div className="relative border-l-2 border-[var(--color-border)] ml-4 pl-8 space-y-6">
        {events.length === 0 && (
          <p className="text-[var(--foreground-muted)] italic text-sm">{t('noEventsRecorded')}</p>
        )}

        {events.map((event) => (
          <div key={event.id} className="relative group">
            <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-[var(--background)] border-2 border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors" />

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <span className="text-xs text-[var(--color-primary)] font-mono font-bold">
                {formatTimeDisplay(
                  typeof event.recordedAt === 'string'
                    ? new Date(event.recordedAt)
                    : event.recordedAt,
                  locale
                )}
              </span>
              <p className="text-[var(--foreground)] text-sm bg-[var(--color-card-bg)] p-2 rounded-lg border border-[var(--color-border)] group-hover:border-[var(--color-border-hover)] transition-colors w-full">
                {event.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <div className="bg-[var(--background)]/95 border border-[var(--color-border)] rounded-2xl p-4 w-80 shadow-lg backdrop-blur-xl animate-in slide-in-from-bottom-5">
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-sm font-bold text-[var(--foreground)]">{t('recordEvent')}</h3>
               <button onClick={() => setIsOpen(false)} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                 <X className="w-4 h-4" />
               </button>
             </div>
             <form onSubmit={handleSubmit}>
               <input
                 autoFocus
                 type="text"
                 value={newTitle}
                 onChange={(e) => setNewTitle(e.target.value)}
                 placeholder={t('whatJustHappened')}
                 className="w-full bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg p-2 text-sm text-[var(--foreground)] focus:border-[var(--color-primary)] focus:outline-none mb-3 placeholder:text-[var(--foreground-muted)]"
               />
               <button
                 type="submit"
                 disabled={isSubmitting}
                 className="w-full bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/30 text-[var(--color-primary)] border border-[var(--color-primary)]/50 rounded-lg py-2 text-sm font-bold transition-all"
               >
                 {isSubmitting ? t('recording') : t('recordToTimeline')}
               </button>
             </form>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <Plus className="w-8 h-8" />
          </button>
        )}
      </div>
    </section>
  );
}
