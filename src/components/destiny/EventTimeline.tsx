'use client';

import { useState } from 'react';
import { createDestinyEvent, updateDestinyEvent, deleteDestinyEvent } from '@/app/actions/destiny';
import { Plus, X, Pencil, Trash2, Check } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { formatTimeDisplay } from '@/lib/date';

type Event = {
  id: string;
  title: string;
  recordedAt: Date | string; // Accept both Date and ISO string
};

export default function EventTimeline({
  dayId,
  events,
  isToday = false,
  canAddEvents = false
}: {
  dayId: string,
  events: Event[],
  isToday?: boolean,
  canAddEvents?: boolean
}) {
  const t = useTranslations('Destiny');
  const locale = useLocale() as 'en' | 'ko' | 'ja';
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await createDestinyEvent(dayId, newTitle);
    setNewTitle('');
    setIsOpen(false);
    setIsSubmitting(false);
  };

  const handleStartEdit = (event: Event) => {
    setEditingId(event.id);
    setEditTitle(event.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleUpdate = async (eventId: string) => {
    if (!editTitle.trim() || isUpdating) return;

    setIsUpdating(true);
    await updateDestinyEvent(eventId, editTitle);
    setEditingId(null);
    setEditTitle('');
    setIsUpdating(false);
  };

  const handleDelete = async (eventId: string) => {
    if (isUpdating) return;

    setIsUpdating(true);
    await deleteDestinyEvent(eventId);
    setIsUpdating(false);
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

              {editingId === event.id ? (
                // Edit mode
                <div className="flex-1 flex gap-2 items-center">
                  <input
                    autoFocus
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdate(event.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="flex-1 bg-[var(--background-secondary)] border border-[var(--color-primary)] rounded-lg p-2 text-sm text-[var(--foreground)] focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdate(event.id)}
                    disabled={isUpdating}
                    className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-[var(--foreground-muted)] hover:bg-[var(--color-card-hover)] rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // View mode
                <div className="flex-1 flex items-start gap-2">
                  <p className="flex-1 text-[var(--foreground)] text-sm bg-[var(--color-card-bg)] p-2 rounded-lg border border-[var(--color-border)] group-hover:border-[var(--color-border-hover)] transition-colors">
                    {event.title}
                  </p>
                  {/* Edit/Delete buttons - only show for today */}
                  {isToday && (
                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(event)}
                        className="p-2 text-[var(--foreground-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-card-hover)] rounded-lg transition-colors"
                        title={t('edit')}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={isUpdating}
                        className="p-2 text-[var(--foreground-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAB - Only show for today */}
      {isToday && (
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
      )}
    </section>
  );
}
